import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, DollarSign, Star, Accessibility, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { FlightService } from "@/api/flight/FlightService";
import type { ISearchFlightResponse } from "@/api/flight/types";

interface VooLeg {
  origem: string;
  origemCodigo: string;
  destino: string;
  destinoCodigo: string;
  dataVoo: string;
  horaPartida: string;
  horaChegada: string;
  duracao: string;
  paradas: number;
  companhia: string;
  logoCompanhia?: string;
}

interface ItinerarioCompleto {
  id: string;
  itineraryId: string;
  token: string;
  vooIda: VooLeg;
  vooVolta: VooLeg;
  precoTotal: number;
  isAcessivel: boolean;
  pontuacao: number;
}

type ApiItinerary = ISearchFlightResponse['data']['itineraries'][0];

// Componente memoizado para o header para evitar re-renderizações desnecessárias
const HeaderSection = React.memo(({ 
  titulo, 
  origem, 
  origemCodigo,
  destino, 
  destinoCodigo,
  data, 
  quantidadeOpcoes, 
  dadosCarregados 
}: {
  titulo: string;
  origem: string;
  origemCodigo?: string;
  destino: string;
  destinoCodigo?: string;
  data?: string;
  quantidadeOpcoes: number;
  dadosCarregados: boolean;
}) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
    <div className="text-center mb-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Plane className="w-8 h-8 text-white" />
      </motion.div>
      <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
        {titulo}
      </h1>
      {dadosCarregados && (
        <p className="text-gray-600 mb-4">
          {quantidadeOpcoes} opções para sua viagem
        </p>
      )}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col gap-3">
          {/* Rota da viagem */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-econotrip-blue">{origem}</div>
              {origemCodigo && (
                <div className="text-sm text-gray-600 font-medium">({origemCodigo})</div>
              )}
              <div className="text-xs text-gray-500 uppercase tracking-wide">Origem</div>
            </div>
            <div className="flex items-center gap-2 px-4">
              <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/40"></div>
              <Plane className="h-5 w-5 text-econotrip-orange transform rotate-90" />
              <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/40"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-econotrip-blue">{destino}</div>
              {destinoCodigo && (
                <div className="text-sm text-gray-600 font-medium">({destinoCodigo})</div>
              )}
              <div className="text-xs text-gray-500 uppercase tracking-wide">Destino</div>
            </div>
          </div>
          
          {/* Data da viagem */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200/50">
            <MapPin className="h-4 w-4 text-econotrip-blue" />
            <span className="text-sm font-medium text-gray-700">
              {data && new Date(data.split(' ')[0]).toLocaleDateString("pt-BR", {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
));

function formatHora(horaIso: string) {
  if (!horaIso) return "";
  const d = new Date(horaIso);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  const match = horaIso.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : horaIso;
}

export default function RoundTripResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [itinerarios, setItinerarios] = useState<ItinerarioCompleto[]>([]);
  const [ordenacao, setOrdenacao] = useState<"preco" | "duracao" | "pontuacao">("preco");
  const [loading, setLoading] = useState(true);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [token, setToken] = useState('');

  // Função para mapear dados da API para interface ItinerarioCompleto
  const mapApiDataToItinerario = useCallback((itinerary: ApiItinerary): ItinerarioCompleto | null => {
    // Para voos de ida e volta, a API retorna legs em ordem cronológica
    // O primeiro leg é sempre ida, o segundo é volta
    const legIda = itinerary.legs?.[0];
    const legVolta = itinerary.legs?.[1];
    
    if (!legIda || !legVolta) {
      console.warn('Itinerário incompleto - faltam legs de ida ou volta:', itinerary.id);
      return null;
    }

    const mapLegToVooLeg = (leg: ApiItinerary['legs'][0]): VooLeg => {
      return {
        origem: leg.origin?.city || '',
        origemCodigo: leg.origin?.displayCode || '',
        destino: leg.destination?.city || '',
        destinoCodigo: leg.destination?.displayCode || '',
        dataVoo: leg.departure?.split("T")[0] || '',
        horaPartida: leg.departure || '',
        horaChegada: leg.arrival || '',
        duracao: leg.durationInMinutes !== undefined ? `${Math.floor(leg.durationInMinutes/60)}h ${leg.durationInMinutes%60}min` : '',
        paradas: leg.stopCount ?? 0,
        companhia: leg.carriers?.marketing?.[0]?.name || '',
        logoCompanhia: leg.carriers?.marketing?.[0]?.logoUrl || ''
      };
    };

    return {
      id: itinerary.id || '',
      itineraryId: itinerary.id || '',
      token: token,
      vooIda: mapLegToVooLeg(legIda),
      vooVolta: mapLegToVooLeg(legVolta),
      precoTotal: itinerary.price?.raw || 0,
      isAcessivel: false,
      pontuacao: itinerary.score || 5
    };
  }, [token]);

  useEffect(() => {
    const searchData = location.state?.searchData;
    if (!searchData) {
      toast({
        title: "Erro",
        description: "Dados de busca não encontrados. Redirecionando...",
        variant: "destructive",
      });
      navigate("/busca-voos");
      return;
    }

    const fetchFlights = async () => {
      try {
        setLoading(true);
        
        // Fazer uma única busca incluindo ida e volta
        const body = {
          origin: searchData.origem,
          destination: searchData.destino,
          departure: searchData.dataIda,
          return: searchData.dataVolta, // Incluir data de volta para busca round-trip
        };

        console.log('Fazendo busca única para ida e volta:', body);
        const response = await FlightService.search(body);
        console.log('Resposta da API:', response);

      if (response.data.context.status === 'incomplete') {
          fetchFlights();
          return;
        }

        setToken(response.data.token);

        const allItineraries = Array.isArray(response?.data?.itineraries) ? response.data.itineraries : [];
        
        if (allItineraries.length === 0) {
          toast({
            title: "Nenhum voo encontrado",
            description: "Não foram encontrados voos para os critérios selecionados.",
            variant: "destructive",
          });
          return;
        }

        const itinerariosCompletos: ItinerarioCompleto[] = [];

        // Processar itinerários completos (ida + volta)
        allItineraries.forEach((itinerary) => {
          try {
            const itinerarioCompleto = mapApiDataToItinerario(itinerary);
            if (itinerarioCompleto) {
              itinerariosCompletos.push(itinerarioCompleto);
            }
          } catch (error) {
            console.warn('Erro ao processar itinerário:', itinerary.id, error);
          }
        });

        console.log('Itinerários completos processados:', itinerariosCompletos.length);

        setItinerarios(itinerariosCompletos);
        setDadosCarregados(true);

      } catch (error) {
        console.error('Erro ao buscar voos:', error);
        toast({
          title: "Erro ao buscar voos",
          description: "Ocorreu um erro ao buscar os voos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.state, navigate, mapApiDataToItinerario]);

  const itinerariosOrdenados = useMemo(() => {
    return [...itinerarios].sort((a, b) => {
      switch (ordenacao) {
        case "preco":
          return a.precoTotal - b.precoTotal;
        case "duracao": {
          // Somar duração de ida e volta para comparação
          const duracaoTotalA = parseInt(a.vooIda.duracao) + parseInt(a.vooVolta.duracao);
          const duracaoTotalB = parseInt(b.vooIda.duracao) + parseInt(b.vooVolta.duracao);
          return duracaoTotalA - duracaoTotalB;
        }
        case "pontuacao":
          return b.pontuacao - a.pontuacao;
        default:
          return 0;
      }
    });
  }, [itinerarios, ordenacao]);

  // Dados estáveis para evitar piscar do header
  const searchData = location.state?.searchData;
  
  // Memoizar dados básicos do header
  const headerData = useMemo(() => {
    const primeiroItinerario = itinerarios[0];
    
    return {
      titulo: "Escolha sua viagem completa",
      origem: primeiroItinerario?.vooIda.origem || searchData?.origem || '',
      origemCodigo: primeiroItinerario?.vooIda.origemCodigo || '',
      destino: primeiroItinerario?.vooIda.destino || searchData?.destino || '',
      destinoCodigo: primeiroItinerario?.vooIda.destinoCodigo || '',
      data: searchData?.dataIda
    };
  }, [searchData, itinerarios]);

  // Contador de opções só é mostrado após carregar
  const quantidadeItinerarios = itinerarios.length;

  const handleEscolherItinerario = (itinerario: ItinerarioCompleto) => {
    // Navegar para a tela de detalhes de ida e volta
    navigate("/detalhes-ida-volta", {
      state: {
        vooIda: {
          id: itinerario.id,
          origem: itinerario.vooIda.origem,
          origemCodigo: itinerario.vooIda.origemCodigo,
          destino: itinerario.vooIda.destino,
          destinoCodigo: itinerario.vooIda.destinoCodigo,
          dataIda: itinerario.vooIda.dataVoo,
          horaPartida: itinerario.vooIda.horaPartida,
          horaChegada: itinerario.vooIda.horaChegada,
          preco: itinerario.precoTotal,
          duracao: itinerario.vooIda.duracao,
          paradas: itinerario.vooIda.paradas,
          companhia: itinerario.vooIda.companhia,
          isAcessivel: itinerario.isAcessivel,
          pontuacao: itinerario.pontuacao,
          itineraryId: itinerario.itineraryId,
          token: itinerario.token,
          isOutbound: true
        },
        vooVolta: {
          id: itinerario.id,
          origem: itinerario.vooVolta.origem,
          origemCodigo: itinerario.vooVolta.origemCodigo,
          destino: itinerario.vooVolta.destino,
          destinoCodigo: itinerario.vooVolta.destinoCodigo,
          dataIda: itinerario.vooVolta.dataVoo,
          horaPartida: itinerario.vooVolta.horaPartida,
          horaChegada: itinerario.vooVolta.horaChegada,
          preco: itinerario.precoTotal,
          duracao: itinerario.vooVolta.duracao,
          paradas: itinerario.vooVolta.paradas,
          companhia: itinerario.vooVolta.companhia,
          isAcessivel: itinerario.isAcessivel,
          pontuacao: itinerario.pontuacao,
          itineraryId: itinerario.itineraryId,
          token: itinerario.token,
          isOutbound: false
        },
        token: token,
        searchData: location.state?.searchData
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Plane className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-2">
            Buscando voos...
          </h2>
          <p className="text-gray-600">Aguarde enquanto encontramos as melhores opções</p>
        </div>
      </div>
    );
  }

  const formatarParadas = (paradas: number) => {
    if (paradas === 0) return "Direto";
    if (paradas === 1) return "1 parada";
    return `${paradas} paradas`;
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

  // Definir o título e contador de forma estável para evitar piscar
  const tituloEtapa = headerData.titulo;
  const opcoesPorEtapa = quantidadeItinerarios;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto py-4 pb-28">
        <HeaderSection 
          titulo={tituloEtapa}
          origem={headerData.origem}
          origemCodigo={headerData.origemCodigo}
          destino={headerData.destino}
          destinoCodigo={headerData.destinoCodigo}
          data={headerData.data}
          quantidadeOpcoes={opcoesPorEtapa}
          dadosCarregados={dadosCarregados}
        />

        {/* Botões de ordenação separados do header */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "preco", label: "Menor preço", icon: DollarSign },
              { id: "duracao", label: "Menor tempo", icon: Clock },
            ].map((opcao) => (
              <motion.button
                key={opcao.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOrdenacao(opcao.id as "preco" | "duracao")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-all shadow-md ${
                  ordenacao === opcao.id
                    ? "bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 text-white shadow-lg"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90"
                }`}
              >
                <opcao.icon className="h-4 w-4" />
                {opcao.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Lista de itinerários completos */}
        <motion.div variants={containerAnimation} initial="hidden" animate="visible" className="space-y-4 mb-6">
          {itinerariosOrdenados.map((itinerario, index) => (
            <motion.div key={itinerario.id} variants={itemAnimation} transition={{ delay: index * 0.1 }}>
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all bg-white/95 backdrop-blur-sm rounded-3xl border-0">
                <div className="p-4">
                  {/* Header do card com preço */}
                  <div className="flex flex-col items-start mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl flex items-center justify-center">
                        <Plane className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-bold text-xl text-econotrip-blue">Viagem Completa</span>
                    </div>
                    <div className="mt-2 text-left">
                      <div className="text-3xl font-bold text-econotrip-orange">R$ {itinerario.precoTotal}</div>
                      <div className="text-sm text-gray-600">ida e volta, por pessoa</div>
                    </div>
                  </div>

                  {/* Seção do Voo de Ida */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Plane className="h-5 w-5 text-econotrip-blue" />
                      <span className="font-semibold text-econotrip-blue">Voo de Ida</span>
                      <span className="text-sm text-gray-500">
                        • {new Date(itinerario.vooIda.dataVoo).toLocaleDateString("pt-BR", { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-50/50 to-gray-50/50 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold text-econotrip-blue mb-1">{formatHora(itinerario.vooIda.horaPartida)}</div>
                          <div className="text-base font-semibold text-gray-800">{itinerario.vooIda.origemCodigo}</div>
                          <div className="text-sm text-gray-600">{itinerario.vooIda.origem}</div>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-full mb-2">
                              <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/50"></div>
                              <div className="w-8 h-8 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center mx-2">
                                <Plane className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/50"></div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-econotrip-blue">{itinerario.vooIda.duracao}</div>
                              <div className="text-xs text-gray-500">{formatarParadas(itinerario.vooIda.paradas)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-econotrip-blue mb-1">{formatHora(itinerario.vooIda.horaChegada)}</div>
                          <div className="text-base font-semibold text-gray-800">{itinerario.vooIda.destinoCodigo}</div>
                          <div className="text-sm text-gray-600">{itinerario.vooIda.destino}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-sm font-medium text-gray-700">{itinerario.vooIda.companhia}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seção do Voo de Volta */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Plane className="h-5 w-5 text-econotrip-blue transform rotate-180" />
                      <span className="font-semibold text-econotrip-blue">Voo de Volta</span>
                      <span className="text-sm text-gray-500">
                        • {new Date(itinerario.vooVolta.dataVoo).toLocaleDateString("pt-BR", { 
                          day: '2-digit', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50/50 to-gray-50/50 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold text-econotrip-blue mb-1">{formatHora(itinerario.vooVolta.horaPartida)}</div>
                          <div className="text-base font-semibold text-gray-800">{itinerario.vooVolta.origemCodigo}</div>
                          <div className="text-sm text-gray-600">{itinerario.vooVolta.origem}</div>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-full mb-2">
                              <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/50"></div>
                              <div className="w-8 h-8 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center mx-2">
                                <Plane className="h-4 w-4 text-white transform rotate-180" />
                              </div>
                              <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/50"></div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-econotrip-blue">{itinerario.vooVolta.duracao}</div>
                              <div className="text-xs text-gray-500">{formatarParadas(itinerario.vooVolta.paradas)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-econotrip-blue mb-1">{formatHora(itinerario.vooVolta.horaChegada)}</div>
                          <div className="text-base font-semibold text-gray-800">{itinerario.vooVolta.destinoCodigo}</div>
                          <div className="text-sm text-gray-600">{itinerario.vooVolta.destino}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-sm font-medium text-gray-700">{itinerario.vooVolta.companhia}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges de acessibilidade */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {itinerario.isAcessivel && (
                      <Badge className="bg-econotrip-blue/10 text-econotrip-blue border-econotrip-blue/20 px-3 py-1 rounded-full">
                        <Accessibility className="h-3 w-3 mr-1" />
                        Acessível
                      </Badge>
                    )}
                  </div>

                  {/* Botão de seleção */}
                  <Button
                    onClick={() => handleEscolherItinerario(itinerario)}
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full h-14 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Escolher esta viagem
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
