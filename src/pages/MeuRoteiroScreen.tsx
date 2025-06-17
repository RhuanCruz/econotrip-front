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
  PiggyBank
} from "lucide-react";
import { PlannerService } from "../api/planner/PlannerService";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export default function MeuRoteiroScreen() {
  const [activeTab, setActiveTab] = useState<"atual" | "historico">("atual");
  const [roteiroAtual, setRoteiroAtual] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    async function fetchRoteiroAtual() {
      setLoading(true);
      try {
        if (token) {
          const planner = await PlannerService.getCurrent(token);
          setRoteiroAtual(planner?.content || null);
        } else {
          setRoteiroAtual(null);
        }
      } catch (e) {
        setRoteiroAtual(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRoteiroAtual();
  }, []);

  // Simulação: roteiroAtual nulo para exibir estado vazio
  const viagensAnteriores = [
    { id: 1, destino: "Paris, França", data: "Dez 2023", avaliacao: 5 },
    { id: 2, destino: "Roma, Itália", data: "Set 2023", avaliacao: 4.5 },
    { id: 3, destino: "Barcelona, Espanha", data: "Jun 2023", avaliacao: 4.8 },
  ];

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
              className="w-20 h-20 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Navigation className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Meu Roteiro
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
              {/* Informações da viagem atual */}
              <motion.div variants={itemAnimation}>
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
              </motion.div>

              {/* Visão Geral da Viagem */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-econotrip-blue" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Visão Geral
                  </h2>
                </div>
                <Card className="p-6 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm border-0">
                  <div className="space-y-2 text-gray-700 text-base">
                    <div><b>Origem:</b> {roteiroAtual.resumo_viagem?.origem}</div>
                    <div><b>Destino:</b> {roteiroAtual.resumo_viagem?.destino}</div>
                    <div><b>Período:</b> {roteiroAtual.resumo_viagem?.periodo}</div>
                    <div><b>Duração:</b> {roteiroAtual.resumo_viagem?.duracao_dias} dias</div>
                    <div><b>Estilo:</b> {roteiroAtual.resumo_viagem?.estilo_viagem}</div>
                    <div><b>Pessoas:</b> {roteiroAtual.resumo_viagem?.numero_pessoas}</div>
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
                <Card className="p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 flex flex-col">
                      <span className="font-medium text-blue-900">Passagens</span>
                      <span className="text-lg font-bold text-blue-700">R$ {roteiroAtual.custos_estimados?.passagens_aereas?.valor_total}</span>
                      <span className="text-xs text-blue-800 mt-1">{roteiroAtual.custos_estimados?.passagens_aereas?.observacoes}</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 flex flex-col">
                      <span className="font-medium text-green-900">Hospedagem</span>
                      <span className="text-lg font-bold text-green-700">R$ {roteiroAtual.custos_estimados?.hospedagem?.valor_total}</span>
                      <span className="text-xs text-green-800 mt-1">{roteiroAtual.custos_estimados?.hospedagem?.observacoes}</span>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 flex flex-col">
                      <span className="font-medium text-yellow-900">Alimentação</span>
                      <span className="text-lg font-bold text-yellow-700">R$ {roteiroAtual.custos_estimados?.alimentacao?.valor_total}</span>
                      <span className="text-xs text-yellow-800 mt-1">{roteiroAtual.custos_estimados?.alimentacao?.observacoes}</span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 flex flex-col">
                      <span className="font-medium text-purple-900">Transporte local</span>
                      <span className="text-lg font-bold text-purple-700">R$ {roteiroAtual.custos_estimados?.transporte_local?.valor_total}</span>
                      <span className="text-xs text-purple-800 mt-1">{roteiroAtual.custos_estimados?.transporte_local?.observacoes}</span>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-3 flex flex-col">
                      <span className="font-medium text-pink-900">Atividades</span>
                      <span className="text-lg font-bold text-pink-700">R$ {roteiroAtual.custos_estimados?.atividades_turismo?.valor_total}</span>
                      <span className="text-xs text-pink-800 mt-1">{roteiroAtual.custos_estimados?.atividades_turismo?.observacoes}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                      <span className="font-medium text-gray-900">Outros</span>
                      <span className="text-lg font-bold text-gray-700">R$ {roteiroAtual.custos_estimados?.outros_gastos?.valor_total}</span>
                      <span className="text-xs text-gray-800 mt-1">{roteiroAtual.custos_estimados?.outros_gastos?.observacoes}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-right">
                    <span className="font-bold text-xl text-econotrip-orange">Total estimado: R$ {roteiroAtual.resumo_financeiro?.custo_total_viagem}</span>
                  </div>
                </Card>
              </motion.div>

              {/* Checklist de preparação */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-econotrip-green" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Checklist de Preparação
                  </h2>
                </div>
                <Card className="p-6 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm border-0">
                  <div className="space-y-4">
                    {checklistItens.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleChecklistItem(item.id)}>
                        {item.concluido ? (
                          <CheckCircle2 className="h-6 w-6 text-econotrip-green flex-shrink-0" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={`flex-1 ${item.concluido ? 'text-gray-600 line-through' : 'text-gray-800 font-medium'}`}>
                          {item.titulo}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Atividades planejadas */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-econotrip-orange" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Atividades Planejadas
                  </h2>
                </div>
                <div className="space-y-3">
                  {roteiroAtual.itinerario_detalhado?.flatMap((dia) =>
                    dia.atividades?.map((atividade, idx) => (
                      <Card key={`${dia.dia}-${idx}`} className="p-4 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-0 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl flex items-center justify-center">
                              <Camera className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-econotrip-blue">{atividade.nome_atividade}</h4>
                              <p className="text-sm text-gray-600">Dia {dia.dia} - {atividade.horario}</p>
                              <p className="text-xs text-gray-500">{atividade.categoria}</p>
                            </div>
                          </div>
                          <Badge className="bg-econotrip-blue/10 text-econotrip-blue border-econotrip-blue/20 rounded-full">
                            {atividade.categoria}
                          </Badge>
                        </div>
                        <div className="mt-2 text-gray-700 text-sm">{atividade.descricao}</div>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Botão adicionar atividade */}
              <motion.div variants={itemAnimation}>
                <Button
                  icon={Plus}
                  size="lg"
                  className="w-full bg-gradient-to-r from-econotrip-green to-econotrip-green/90 hover:from-econotrip-green/90 hover:to-econotrip-green text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                  disabled
                >
                  Adicionar Nova Atividade
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
                    Suas Aventuras Anteriores
                  </h2>
                </div>
                <div className="space-y-4">
                  {viagensAnteriores.map((viagem) => (
                    <Card key={viagem.id} className="p-6 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-0 hover:shadow-xl transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center shadow-lg">
                            <Plane className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-econotrip-blue text-lg">{viagem.destino}</h3>
                            <p className="text-gray-600">{viagem.data}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                            <span className="font-bold text-econotrip-blue text-lg">{viagem.avaliacao}</span>
                          </div>
                          <p className="text-sm text-gray-600">Avaliação</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Estatísticas */}
              <motion.div variants={itemAnimation}>
                <Card className="p-6 bg-gradient-to-r from-econotrip-green/10 to-econotrip-blue/10 rounded-3xl shadow-lg border-0">
                  <div className="text-center">
                    <h3 className="font-bold text-econotrip-blue text-xl mb-4">Suas Conquistas</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-econotrip-blue">4</div>
                        <div className="text-sm text-gray-600">Países visitados</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-econotrip-orange">28</div>
                        <div className="text-sm text-gray-600">Dias viajando</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-econotrip-green">4.7</div>
                        <div className="text-sm text-gray-600">Avaliação média</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
