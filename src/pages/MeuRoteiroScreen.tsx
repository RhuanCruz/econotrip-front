import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle,
  Plus,
  Heart,
  Camera,
  Star,
  Navigation,
  Plane,
  Globe,
  PiggyBank,
  X,
  ChevronDown,
  Timer,
  Info,
  BookOpen
} from "lucide-react";
import { PlannerService } from "../api/planner/PlannerService";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { StandardModal } from "@/components/ui-custom/StandardModal";

export default function MeuRoteiroScreen() {
  const [activeTab, setActiveTab] = useState<"atual" | "historico">("atual");
  const [roteiroAtual, setRoteiroAtual] = useState(null);
  const [roteiroAtualId, setRoteiroAtualId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historicoViagens, setHistoricoViagens] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [errorHistorico, setErrorHistorico] = useState(null);
  const [isCancellingTrip, setIsCancellingTrip] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isFinishingTrip, setIsFinishingTrip] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set()); // Dias expandidos (por padrão todos colapsados)

  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRoteiroAtual() {
      setLoading(true);
      try {
        if (token) {
          const planner = await PlannerService.getCurrent(token);
          setRoteiroAtual(planner?.content || null);
          setRoteiroAtualId(planner?.id)
        } else {
          setRoteiroAtual(null);
          setRoteiroAtualId(null);
        }
      } catch (e) {
        setRoteiroAtual(null);
        setRoteiroAtualId(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRoteiroAtual();
  }, [token]);

  // Buscar histórico de viagens quando a aba for selecionada
  useEffect(() => {
    async function fetchHistoricoViagens() {
      if (!token) return;
      
      setLoadingHistorico(true);
      setErrorHistorico(null);
      
      try {
        const response = await PlannerService.list(token);
        const viagensOrdenadas = (response.records || []).sort((a, b) => {
          // Ordenar pela data de criação mais recente primeiro
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setHistoricoViagens(viagensOrdenadas);
      } catch (error) {
        setErrorHistorico("Erro ao carregar histórico de viagens");
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoadingHistorico(false);
      }
    }

    if (activeTab === "historico" && token && historicoViagens.length === 0) {
      fetchHistoricoViagens();
    }
  }, [activeTab, token, historicoViagens.length]);

  // Formatar data para exibição
  const formatarData = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

    const formatarDataCurta = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: '2-digit', 
        year: '2-digit' 
      });
    } catch {
      return dateString;
    }
  };

  // Calcular avaliação fictícia baseada no ID (para fins de demonstração)
  const calcularAvaliacao = (id) => {
    const avaliacoes = [4.2, 4.5, 4.8, 5.0, 4.7, 4.3, 4.9];
    return avaliacoes[id % avaliacoes.length];
  };

  // Função para formatar nome da cidade (pegar apenas nome e região)
  const formatarNomeCidade = (cidadeCompleta) => {
    if (!cidadeCompleta) return '';
    
    const partes = cidadeCompleta.split(', ');
    if (partes.length >= 2) {
      // Retorna apenas nome da cidade e a última parte (região/país)
      return `${partes[0]}, ${partes[partes.length - 1]}`;
    }
    
    return cidadeCompleta;
  };

  // Função para formatar destinos do histórico (array ou string)
  const formatarDestinosHistorico = (destination) => {
    if (!destination) return '';
    
    // Se for array, formatar cada destino e juntar com " • "
    if (Array.isArray(destination)) {
      return destination.map(dest => formatarNomeCidade(dest)).join(' • ');
    }
    
    // Se for string, formatar normalmente
    return formatarNomeCidade(destination);
  };

  // Checklist interativo com persistência local
  const checklistStorageKey = 'checklistItensRoteiro';
  const checklistDefault = [
    { id: 1, titulo: "Reservar passagem aérea", concluido: true },
    { id: 2, titulo: "Reservar hotel", concluido: true },
    { id: 3, titulo: "Contratar seguro viagem", concluido: true },
    { id: 4, titulo: "Verificar documentos", concluido: false },
    { id: 5, titulo: "Fazer check-in online", concluido: false },
  ];
  const [checklistItens, setChecklistItens] = useState(() => {
    const saved = localStorage.getItem(checklistStorageKey);
    return saved ? JSON.parse(saved) : checklistDefault;
  });
  useEffect(() => {
    localStorage.setItem(checklistStorageKey, JSON.stringify(checklistItens));
  }, [checklistItens]);

  // Progresso baseado nos itens do checklist
  const progressoChecklist = Math.round((checklistItens.filter(i => i.concluido).length / checklistItens.length) * 100);

  function toggleChecklistItem(id) {
    setChecklistItens(itens => itens.map(item => item.id === id ? { ...item, concluido: !item.concluido } : item));
  }

  // Função para alternar expansão dos dias
  function toggleDayExpansion(dayNumber) {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  }

  // Função para abrir modal de confirmação de cancelamento
  const abrirModalCancelamento = () => {
    setShowCancelModal(true);
  };

  // Função para abrir modal de confirmação de conclusão
  const abrirModalConclusao = () => {
    setShowFinishModal(true);
  };

  // Função para cancelar viagem atual
  const cancelarViagemAtual = async () => {
    if (!token || !roteiroAtual || !roteiroAtualId) return;
    
    setShowCancelModal(false);
    setIsCancellingTrip(true);
    
    try {
      await PlannerService.cancelCurrent(roteiroAtualId, token);
      setRoteiroAtual(null);
      setRoteiroAtualId(null);
      
      toast({
        title: "Viagem cancelada",
        description: "Sua viagem foi cancelada com sucesso.",
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao cancelar viagem:', error);
      toast({
        title: "Erro ao cancelar viagem",
        description: "Não foi possível cancelar a viagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCancellingTrip(false);
    }
  };

  // Função para concluir viagem atual
  const concluirViagemAtual = async () => {
    if (!token || !roteiroAtual || !roteiroAtualId) return;
    
    setShowFinishModal(false);
    setIsFinishingTrip(true);
    
    try {
      await PlannerService.finishCurrent(roteiroAtualId, token);
      setRoteiroAtual(null);
      setRoteiroAtualId(null);
      
      toast({
        title: "Viagem concluída!",
        description: "Esperamos que tenha sido uma experiência incrível! Sua viagem foi movida para o histórico.",
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao concluir viagem:', error);
      toast({
        title: "Erro ao concluir viagem",
        description: "Não foi possível concluir a viagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsFinishingTrip(false);
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header moderno */}
          <motion.div variants={itemAnimation} className="text-center py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-econotrip-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Navigation className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Simulador de Roteiro e Custo
            </h1>
            <p className="text-lg text-gray-600 text-balance">
              Organize e acompanhe suas aventuras
            </p>
          </motion.div>

          {/* Tabs modernos */}
          <motion.div variants={itemAnimation}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("atual")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "atual"
                      ? "bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 text-white shadow-lg"
                      : "text-gray-600 hover:text-econotrip-blue"
                  }`}
                >
                  Viagem Atual
                </button>
                <button
                  onClick={() => setActiveTab("historico")}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "historico"
                      ? "bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 text-white shadow-lg"
                      : "text-gray-600 hover:text-econotrip-blue"
                  }`}
                >
                  Histórico
                </button>
              </div>
            </div>
          </motion.div>

          {/* Estado vazio: sem viagem atual */}
          {activeTab === "atual" && !roteiroAtual && (
            <motion.div
              variants={itemAnimation}
              className="flex flex-col items-center justify-center py-16"
            >
              <h2 className="text-xl font-bold text-econotrip-blue mb-2">Nenhuma viagem atual</h2>
              <p className="text-gray-600 mb-6 text-center">Você ainda não criou um roteiro. Que tal planejar sua próxima aventura?</p>
              <Button
                icon={Plus}
                size="lg"
                className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                onClick={() => navigate("/nova-viagem")}
              >
                Criar Nova Viagem
              </Button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Encontre o roteiro perfeito para sua próxima jornada!
              </p>
            </motion.div>
          )}

          {activeTab === "atual" && roteiroAtual && (
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Visão Geral da Viagem */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-econotrip-blue" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Visão Geral
                  </h2>
                </div>
                <Card className="p-6 rounded-2xl shadow-lg bg-white border-0">
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-econotrip-blue" />
                      <span><b>Origem:</b> {roteiroAtual.resumo_viagem?.origem}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-econotrip-orange" />
                      <span><b>Destino:</b> {roteiroAtual.resumo_viagem?.destino}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span><b>Período:</b> {roteiroAtual.resumo_viagem?.periodo}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span><b>Duração:</b> {roteiroAtual.resumo_viagem?.duracao_dias} dias</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-gray-600" />
                      <span><b>Estilo:</b> {roteiroAtual.resumo_viagem?.estilo_viagem}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <span><b>Pessoas:</b> {roteiroAtual.resumo_viagem?.numero_pessoas}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Custos Estimados */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <PiggyBank className="h-5 w-5 text-econotrip-orange" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Custos Estimados
                  </h2>
                </div>
                <Card className="p-6 rounded-2xl shadow-lg bg-white border-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Passagens</span>
                      </div>
                      <span className="text-xl font-bold text-blue-700">R$ {roteiroAtual.custos_estimados?.passagens_aereas?.valor_total}</span>
                      <p className="text-xs text-blue-600 mt-1">{roteiroAtual.custos_estimados?.passagens_aereas?.observacoes || "Voos ida e volta"}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Hospedagem</span>
                      </div>
                      <span className="text-xl font-bold text-green-700">R$ {roteiroAtual.custos_estimados?.hospedagem?.valor_total}</span>
                      <p className="text-xs text-green-600 mt-1">{roteiroAtual.custos_estimados?.hospedagem?.observacoes || "Hotéis e acomodações"}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">Alimentação</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-700">R$ {roteiroAtual.custos_estimados?.alimentacao?.valor_total}</span>
                      <p className="text-xs text-yellow-600 mt-1">{roteiroAtual.custos_estimados?.alimentacao?.observacoes || "Refeições e bebidas"}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Transporte</span>
                      </div>
                      <span className="text-xl font-bold text-purple-700">R$ {roteiroAtual.custos_estimados?.transporte_local?.valor_total}</span>
                      <p className="text-xs text-purple-600 mt-1">{roteiroAtual.custos_estimados?.transporte_local?.observacoes || "Táxi, ônibus e transfers"}</p>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera className="w-5 h-5 text-pink-600" />
                        <span className="font-medium text-pink-900">Atividades</span>
                      </div>
                      <span className="text-xl font-bold text-pink-700">R$ {roteiroAtual.custos_estimados?.atividades_turismo?.valor_total}</span>
                      <p className="text-xs text-pink-600 mt-1">{roteiroAtual.custos_estimados?.atividades_turismo?.observacoes || "Passeios e atrações"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">Outros</span>
                      </div>
                      <span className="text-xl font-bold text-gray-700">R$ {roteiroAtual.custos_estimados?.outros_gastos?.valor_total}</span>
                      <p className="text-xs text-gray-600 mt-1">{roteiroAtual.custos_estimados?.outros_gastos?.observacoes || "Compras e extras"}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-econotrip-orange/10 rounded-xl border border-econotrip-orange/20">
                    <div className="text-center">
                      <span className="font-bold text-2xl text-econotrip-orange">R$ {roteiroAtual.resumo_financeiro?.custo_total_viagem}</span>
                      <p className="text-sm text-gray-600 mt-1">Total estimado</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Informações da viagem atual */}
              {/* <motion.div variants={itemAnimation}>
                <Card className="p-6 bg-gradient-to-r from-econotrip-blue/10 to-econotrip-orange/10 rounded-3xl shadow-lg border-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center shadow-lg">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-econotrip-blue text-xl">{roteiroAtual.destino}</h3>
                        <p className="text-gray-600">{roteiroAtual.dataInicio} - {roteiroAtual.dataFim}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-econotrip-orange">{progressoChecklist}%</div>
                      <div className="text-sm text-gray-600">Concluído</div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={progressoChecklist} 
                    className="h-3 mb-4 bg-gray-200 rounded-full" 
                  />
                  
                  <p className="text-gray-700 text-center">
                    Sua viagem está quase pronta! Faltam poucos preparativos.
                  </p>
                </Card>
              </motion.div> */}

              {/* Checklist de preparação */}
              {/* <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-econotrip-green" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Checklist de Preparação
                  </h2>
                </div>
                <Card className="p-6 rounded-2xl shadow-lg bg-white border-0">
                  <div className="space-y-3">
                    {checklistItens.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" 
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        {item.concluido ? (
                          <CheckCircle2 className="h-6 w-6 text-econotrip-green" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                        <span className={`flex-1 ${item.concluido ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {item.titulo}
                        </span>
                        {item.concluido && (
                          <Badge className="bg-econotrip-green/10 text-econotrip-green">
                            ✓
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className="text-sm font-bold text-econotrip-green">{progressoChecklist}%</span>
                    </div>
                    <Progress value={progressoChecklist} className="h-2" />
                  </div>
                </Card>
              </motion.div> */}

              {/* Atividades planejadas */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-econotrip-orange" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Atividades Planejadas
                  </h2>
                </div>
                <div className="space-y-4">
                  {roteiroAtual.itinerario_detalhado?.map((dia) => (
                    <Card key={dia.dia} className="p-6 rounded-2xl shadow-lg bg-white border-0">
                      {/* Cabeçalho do dia */}
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleDayExpansion(dia.dia)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-econotrip-blue rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">{dia.dia}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-econotrip-blue">Dia {dia.dia}</h3>
                            {dia.cidade && (
                              <div className="flex items-center gap-1 mb-1">
                                <MapPin className="w-3 h-3 text-econotrip-blue-light" />
                                <span className="text-sm font-medium text-econotrip-blue-light">{formatarNomeCidade(dia.cidade)}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600">{dia.atividades?.length || 0} atividades</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedDays.has(dia.dia) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                      
                      {/* Atividades do dia */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedDays.has(dia.dia) ? "auto" : 0,
                          opacity: expandedDays.has(dia.dia) ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          {dia.atividades?.map((atividade, idx) => (
                            <div key={`${dia.dia}-${idx}`} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800">{atividade.nome_atividade}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{atividade.horario}</p>
                                  <p className="text-sm text-gray-700 mt-2">{atividade.descricao}</p>
                                </div>
                                <Badge className="bg-econotrip-blue/10 text-econotrip-blue ml-3">
                                  {atividade.categoria}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          
                          {(!dia.atividades || dia.atividades.length === 0) && (
                            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                              <p>Nenhuma atividade planejada</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Dicas, observações e informações práticas */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-econotrip-green" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Dicas e Informações
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Dicas de Economia */}
                  {roteiroAtual.dicas_economia && roteiroAtual.dicas_economia.length > 0 && (
                    <Card className="p-4 flex flex-col gap-2 bg-green-50 border-green-100 rounded-2xl shadow-lg border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="text-green-600 h-5 w-5" />
                        <h3 className="font-semibold text-green-800">Dicas de Economia</h3>
                      </div>
                      <ul className="list-disc list-inside text-green-900 text-sm">
                        {roteiroAtual.dicas_economia.map((dica, idx) => (
                          <li key={idx}>{dica}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Dicas de Otimização de Tempo */}
                  {roteiroAtual.dicas_otimizacao_tempo && roteiroAtual.dicas_otimizacao_tempo.length > 0 && (
                    <Card className="p-4 flex flex-col gap-2 bg-blue-50 border-blue-100 rounded-2xl shadow-lg border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="text-blue-600 h-5 w-5" />
                        <h3 className="font-semibold text-blue-800">Dicas de Otimização de Tempo</h3>
                      </div>
                      <ul className="list-disc list-inside text-blue-900 text-sm">
                        {roteiroAtual.dicas_otimizacao_tempo.map((dica, idx) => (
                          <li key={idx}>{dica}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Observações Importantes */}
                  {roteiroAtual.observacoes_importantes && roteiroAtual.observacoes_importantes.length > 0 && (
                    <Card className="p-4 flex flex-col gap-2 bg-yellow-50 border-yellow-100 rounded-2xl shadow-lg border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="text-yellow-600 h-5 w-5" />
                        <h3 className="font-semibold text-yellow-800">Observações Importantes</h3>
                      </div>
                      <ul className="list-disc list-inside text-yellow-900 text-sm">
                        {roteiroAtual.observacoes_importantes.map((obs, idx) => (
                          <li key={idx}>{obs}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Informações Práticas */}
                  {roteiroAtual.informacoes_praticas && (
                    <Card className="p-4 flex flex-col gap-2 bg-purple-50 border-purple-100 rounded-2xl shadow-lg border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="text-purple-600 h-5 w-5" />
                        <h3 className="font-semibold text-purple-800">Informações Práticas</h3>
                      </div>
                      <ul className="text-purple-900 text-sm space-y-1">
                        {roteiroAtual.informacoes_praticas.melhor_epoca_visitar && (
                          <li><b>Melhor época para visitar:</b> {roteiroAtual.informacoes_praticas.melhor_epoca_visitar}</li>
                        )}
                        {roteiroAtual.informacoes_praticas.documentos_necessarios && roteiroAtual.informacoes_praticas.documentos_necessarios.length > 0 && (
                          <li><b>Documentos necessários:</b> {roteiroAtual.informacoes_praticas.documentos_necessarios.join(', ')}</li>
                        )}
                        {roteiroAtual.informacoes_praticas.fuso_horario && (
                          <li><b>Fuso horário:</b> {roteiroAtual.informacoes_praticas.fuso_horario}</li>
                        )}
                        {roteiroAtual.informacoes_praticas.idioma_local && (
                          <li><b>Idioma local:</b> {roteiroAtual.informacoes_praticas.idioma_local}</li>
                        )}
                        {roteiroAtual.informacoes_praticas.moeda_local && (
                          <li><b>Moeda local:</b> {roteiroAtual.informacoes_praticas.moeda_local}</li>
                        )}
                        {roteiroAtual.informacoes_praticas.voltagem && (
                          <li><b>Voltagem:</b> {roteiroAtual.informacoes_praticas.voltagem}</li>
                        )}
                      </ul>
                    </Card>
                  )}
                </div>
              </motion.div>

              {/* Botão adicionar atividade */}
              {/* <motion.div variants={itemAnimation}>
                <Button
                  icon={Plus}
                  size="lg"
                  className="w-full bg-gradient-to-r from-econotrip-green to-econotrip-green/90 hover:from-econotrip-green/90 hover:to-econotrip-green text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                  disabled
                >
                  Adicionar Nova Atividade
                </Button>
              </motion.div> */}

              {/* Botão cancelar viagem atual */}
              <motion.div variants={itemAnimation}>
                <Button
                  icon={X}
                  size="lg"
                  className="w-full bg-econotrip-coral hover:bg-econotrip-coral/90 text-white rounded-xl shadow-lg"
                  onClick={abrirModalCancelamento}
                  disabled={isCancellingTrip}
                >
                  {isCancellingTrip ? 'Cancelando...' : 'Cancelar Viagem'}
                </Button>
              </motion.div>

              {/* Botão concluir viagem */}
              <motion.div variants={itemAnimation}>
                <Button
                  icon={CheckCircle2}
                  size="lg"
                  className="w-full bg-econotrip-primary hover:bg-econotrip-primary/90 text-white rounded-xl shadow-lg"
                  onClick={abrirModalConclusao}
                  disabled={isFinishingTrip}
                >
                  {isFinishingTrip ? 'Concluindo...' : 'Concluir Viagem'}
                </Button>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "historico" && (
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-econotrip-blue" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Suas simulações anteriores
                  </h2>
                </div>
                
                {loadingHistorico && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-econotrip-blue border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Carregando histórico...</span>
                  </div>
                )}
                
                {errorHistorico && (
                  <Card className="p-6 rounded-2xl shadow-lg bg-red-50 border-0">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">{errorHistorico}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Tentar Novamente
                      </Button>
                    </div>
                  </Card>
                )}
                
                {!loadingHistorico && !errorHistorico && historicoViagens.length === 0 && (
                  <Card className="p-8 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-0">
                    <div className="text-center">
                      <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Nenhuma viagem no histórico
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Você ainda não tem viagens concluídas.
                      </p>
                      <Button
                        onClick={() => navigate("/nova-viagem")}
                        className="bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white"
                      >
                        Planejar Nova Viagem
                      </Button>
                    </div>
                  </Card>
                )}
                
                {!loadingHistorico && !errorHistorico && historicoViagens.length > 0 && (
                  <div className="space-y-4">
                    {historicoViagens.map((viagem) => (
                      <Card key={viagem.id} className="p-6 rounded-2xl shadow-lg bg-white border-0 hover:shadow-xl transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-econotrip-blue to-econotrip-blue/80 rounded-2xl flex items-center justify-center shadow-lg">
                            <Plane className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-econotrip-blue text-lg group-hover:text-econotrip-blue/80 transition-colors">
                              {formatarDestinosHistorico(viagem.destination)}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600 text-sm">{formatarDataCurta(viagem.start)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600 text-sm">
                                  {(() => {
                                    try {
                                      const start = new Date(viagem.start);
                                      const end = new Date(viagem.end);
                                      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                      return `${days > 0 ? days : 1} dias`;
                                    } catch {
                                      return "1 dia";
                                    }
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Estatísticas */}
              {!loadingHistorico && !errorHistorico && historicoViagens.length > 0 && (
                <motion.div variants={itemAnimation}>
                  <Card className="p-6 bg-gradient-to-r from-econotrip-green/10 to-econotrip-blue/10 rounded-3xl shadow-lg border-0">
                    <div className="text-center">
                      <h3 className="font-bold text-econotrip-blue text-xl mb-4">Suas Conquistas</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-2xl font-bold text-econotrip-blue">{historicoViagens.length}</div>
                          <div className="text-sm text-gray-600">Viagens planejadas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-econotrip-orange">
                            {historicoViagens.reduce((acc, viagem) => {
                              try {
                                const start = new Date(viagem.start);
                                const end = new Date(viagem.end);
                                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                                return acc + (days > 0 ? days : 0);
                              } catch {
                                return acc;
                              }
                            }, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Dias planejados</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal de confirmação de cancelamento */}
      <StandardModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={cancelarViagemAtual}
        type="warning"
        title="Cancelar Viagem"
        description="Tem certeza que deseja cancelar esta viagem? Esta ação não pode ser desfeita e todos os dados do roteiro serão perdidos."
        confirmText="Sim, cancelar"
        cancelText="Não, manter viagem"
        showCancel={true}
      />

      {/* Modal de confirmação de conclusão */}
      <StandardModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={concluirViagemAtual}
        type="success"
        title="Concluir Viagem"
        description="Tem certeza que deseja marcar esta viagem como concluída? Ela será movida para o seu histórico de viagens."
        confirmText="Sim, concluir"
        cancelText="Não, manter atual"
        showCancel={true}
      />
    </div>
  );
}
