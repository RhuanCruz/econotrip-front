import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Clock, 
  DollarSign, 
  Filter,
  ArrowRight,
  Search,
  Star,
  Accessibility,
  Leaf,
  Award,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { FlightService } from "@/api/flight/FlightService";

interface Voo {
  id: string;
  origem: string;
  origemCodigo: string;
  destino: string;
  destinoCodigo: string;
  dataIda: string;
  horaPartida: string;
  horaChegada: string;
  preco: number;
  duracao: string;
  paradas: number;
  companhia: string;
  isAcessivel: boolean;
  pontuacao: number;
  departureToken?: string; // usado para buscar voo de volta
}

// Utilitário para formatar hora ISO para HH:mm
function formatHora(horaIso: string) {
  if (!horaIso) return "";
  const d = new Date(horaIso);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  // fallback para string tipo "14:30" ou "14:30+1"
  const match = horaIso.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : horaIso;
}

export default function ResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [voos, setVoos] = useState<Voo[]>([]);
  const [ordenacao, setOrdenacao] = useState<"preco" | "duracao" | "pontuacao">("preco");

  useEffect(() => {
    const searchData = location.state?.searchData;
    if (!searchData) return;
    // Monta o body para a API
    const body = {
      origin: searchData.origem,
      destination: searchData.destino,
      departure: searchData.dataIda,
      return: searchData.dataVolta || undefined,
      departureToken: searchData.departureToken || undefined
    };
    FlightService.search(body).then((res) => {
      // Converte os resultados para o formato Voo[] usado na tela
      const allFlights = [
        ...(res.best_flights || []),
        ...(res.other_flights || [])
      ];
      console.log(allFlights[0]);

      setVoos(
        allFlights.map((f, idx) => ({
          id: f.booking_token || String(idx),
          origem: body.origin,
          origemCodigo: f.flights[0]?.departure_airport?.id || "",
          destino: body.destination,
          destinoCodigo: f.flights[f.flights.length-1]?.arrival_airport?.id || "",
          dataIda: body.departure,
          horaPartida: f.flights[0]?.departure_airport?.time || "",
          horaChegada: f.flights[f.flights.length-1]?.arrival_airport?.time || "",
          preco: f.price,
          duracao: `${Math.floor((f.total_duration || 0)/60)}h ${(f.total_duration || 0)%60}min`,
          paradas: f.layovers?.length || 0,
          companhia: f.flights[0]?.airline || "",
          isAcessivel: false,
          pontuacao: 5,
          departureToken: f.departure_token || ""
        }))
      );
    });
  }, [location.state]);

  const voosOrdenados = [...voos].sort((a, b) => {
    switch (ordenacao) {
      case "preco":
        return a.preco - b.preco;
      case "duracao":
        return parseInt(a.duracao) - parseInt(b.duracao);
      case "pontuacao":
        return b.pontuacao - a.pontuacao;
      default:
        return 0;
    }
  });

  const handleVerDetalhes = (voo: Voo) => {
    toast({
      title: "Carregando detalhes...",
      description: `Voo ${voo.companhia} ${voo.origemCodigo} → ${voo.destinoCodigo}`,
    });
    const searchData = location.state?.searchData;
    const detailParams: {
      origem?: string;
      destino?: string;
      dataIda?: string;
      dataVolta?: string;
      bookingToken: string;
    } = {
      origem: searchData?.origem,
      destino: searchData?.destino,
      dataIda: searchData?.dataIda,
      bookingToken: voo.id
    };
    if (searchData?.dataVolta && searchData.dataVolta !== "") {
      detailParams.dataVolta = searchData.dataVolta;
    }
    navigate("/detalhes-voo", {
      state: {
        searchData: {
          ...detailParams,
          dataVolta: detailParams.dataVolta ?? undefined
        }
      }
    });
  };

  const handleNovaBusca = () => {
    navigate("/busca-voos");
  };

  const handleEscolherVooIda = async (voo: Voo) => {
    const searchData = location.state?.searchData;
    console.log(voo);
    if (!searchData) return;
    try {
      // Refaz a busca para o voo de volta, enviando o departureToken do voo de ida
      const body = {
        origin: searchData.origem,
        destination: searchData.destino,
        departure: searchData.dataIda,
        return: searchData.dataVolta,
        departureToken: voo.departureToken // id = booking_token
      };
      const res = await FlightService.search(body);
      console.log(voo);
      // Aqui você pode navegar para a tela de seleção do voo de volta, ou atualizar o estado conforme o fluxo desejado
      navigate("/resultados-voos", { state: { searchData: { ...searchData, departureToken: voo.departureToken }, results: res, etapa: "volta" } });
    } catch (err) {
      toast({ title: "Erro ao buscar voos de volta", description: String(err), variant: "destructive" });
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto py-4 pb-28">
        {/* Header moderno */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Plane className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Voos Encontrados
            </h1>
            <p className="text-gray-600 mb-4">
              {voos.length} opções incríveis para sua viagem
            </p>
            
            {/* Info da busca */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-econotrip-blue" />
                  <span className="font-semibold text-econotrip-blue">
                    {location.state?.searchData?.origem} → {location.state?.searchData?.destino}
                    {location.state?.searchData?.dataVolta && (
                      <>
                        <span className="mx-2 text-gray-400">|</span>
                        {location.state?.searchData?.destino} → {location.state?.searchData?.origem}
                      </>
                    )}
                  </span>
                </div>
                <div className="text-gray-600">
                  {location.state?.searchData?.dataIda &&
                    new Date(location.state.searchData.dataIda).toLocaleDateString("pt-BR")}
                  {location.state?.searchData?.dataVolta && (
                    <>
                      <span className="mx-1">•</span>
                      {new Date(location.state.searchData.dataVolta).toLocaleDateString("pt-BR")}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filtros de ordenação modernos */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "preco", label: "Menor preço", icon: DollarSign },
                { id: "duracao", label: "Menor tempo", icon: Clock },
                { id: "pontuacao", label: "Melhor avaliado", icon: Star },
              ].map((opcao) => (
                <motion.button
                  key={opcao.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOrdenacao(opcao.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all whitespace-nowrap shadow-md ${
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
        </motion.div>

        {/* Lista de voos moderna */}
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-6"
        >
          {voosOrdenados.map((voo, index) => (
            <motion.div
              key={voo.id}
              variants={itemAnimation}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all bg-white/95 backdrop-blur-sm rounded-3xl border-0">
                <div className="p-6">
                  {/* Header do voo */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl flex items-center justify-center">
                          <Plane className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-xl text-econotrip-blue">
                            {voo.companhia}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold text-econotrip-orange">
                        R$ {voo.preco.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">por pessoa</div>
                    </div>
                  </div>

                  {/* Horários modernos */}
                  <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-xl font-bold text-econotrip-blue mb-1">
                          {formatHora(voo.horaPartida)}
                        </div>
                        <div className="text-lg font-semibold text-gray-800">{voo.origemCodigo}</div>
                        <div className="text-sm text-gray-600">{voo.origem}</div>
                      </div>
                      
                      <div className="flex-1 px-6">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-full mb-2">
                            <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/50"></div>
                            <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center mx-2 shadow-lg">
                              <Plane className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 border-t-2 border-dashed border-econotrip-orange/50"></div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-econotrip-blue">{voo.duracao}</div>
                            <div className="text-xs text-gray-500">{formatarParadas(voo.paradas)}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold text-econotrip-blue mb-1">
                          {formatHora(voo.horaChegada)}
                        </div>
                        <div className="text-lg font-semibold text-gray-800">{voo.destinoCodigo}</div>
                        <div className="text-sm text-gray-600">{voo.destino}</div>
                      </div>
                    </div>
                  </div>

                  {/* Badges modernos */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {voo.isAcessivel && (
                      <Badge className="bg-econotrip-blue/10 text-econotrip-blue border-econotrip-blue/20 px-3 py-1 rounded-full">
                        <Accessibility className="h-3 w-3 mr-1" />
                        Acessível
                      </Badge>
                    )}
                  </div>

                  {/* Botão moderno */}
                  <Button
                    onClick={() =>
                      location.state?.searchData?.dataVolta && location.state?.etapa !== "volta"
                        ? handleEscolherVooIda(voo)
                        : handleVerDetalhes(voo)
                    }
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full h-14 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    {location.state?.etapa === "volta"
                      ? "Escolher voo da volta"
                      : location.state?.searchData?.dataVolta
                        ? "Escolher voo da ida"
                        : "Ver detalhes"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Botão nova busca fixo moderno
        <div className="fixed bottom-24 left-0 right-0 px-4 z-30">
          <div className="max-w-screen-sm mx-auto">
            <Button
              onClick={handleNovaBusca}
              className="w-full h-14 bg-white/95 backdrop-blur-sm text-econotrip-blue text-lg font-semibold rounded-2xl shadow-xl border-2 border-econotrip-blue/20 hover:bg-white hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Nova Busca
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
