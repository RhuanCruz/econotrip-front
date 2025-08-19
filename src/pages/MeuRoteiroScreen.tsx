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
  const [historicoViagens, setHistoricoViagens] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [errorHistorico, setErrorHistorico] = useState(null);

  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { toast } = useToast();


  // Buscar histórico de simulações ao montar
  useEffect(() => {
    async function fetchHistoricoViagens() {
      if (!token) return;
      setLoadingHistorico(true);
      setErrorHistorico(null);
      try {
        const response = await PlannerService.list(token);
        const viagensOrdenadas = (response.records || []).sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setHistoricoViagens(viagensOrdenadas);
      } catch (error) {
        setErrorHistorico("Erro ao carregar simulações");
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoadingHistorico(false);
      }
    }
    fetchHistoricoViagens();
  }, [token]);

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

  // ...nenhuma lógica de checklist, viagem atual ou modais...

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
          {/* Header */}
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
              Minhas Simulações
            </h1>
            <p className="text-lg text-gray-600 text-balance">
              Veja todas as simulações de roteiros que você já realizou.
            </p>
          </motion.div>

          {/* Lista de Simulações */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-econotrip-blue" />
                <h2 className="text-lg font-semibold text-econotrip-blue">
                  Suas Simulações
                </h2>
              </div>
              <button
                onClick={() => navigate("/nova-viagem")}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-econotrip-blue text-white hover:bg-econotrip-blue/90 shadow focus:outline-none"
                aria-label="Nova Simulação"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            {loadingHistorico && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-econotrip-blue border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Carregando simulações...</span>
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
                    Nenhuma simulação encontrada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Você ainda não realizou nenhuma simulação de roteiro.
                  </p>
                  <Button
                    onClick={() => navigate("/nova-viagem")}
                    className="bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white"
                  >
                    Criar Nova Simulação
                  </Button>
                </div>
              </Card>
            )}

            {!loadingHistorico && !errorHistorico && historicoViagens.length > 0 && (
              <div className="space-y-4">
                {historicoViagens.map((viagem) => (
                  <Card
                    key={viagem.id}
                    className="p-6 rounded-2xl shadow-lg bg-white border-0 hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => navigate(`/meu-roteiro/${viagem.id}`)}
                  >
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
        </motion.div>
      </div>
    </div>
  );
}
