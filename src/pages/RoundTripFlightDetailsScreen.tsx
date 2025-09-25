import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility, ArrowLeft, HelpCircle, Check, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { FlightService } from "@/api/flight/FlightService";
import { RoundTripFlightDetailsSkeleton } from "@/components/ui-custom/RoundTripFlightDetailsSkeleton";

// Helper to safely extract string from API fields that may be string or object
function getString(val: unknown) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (obj.name) return String(obj.name);
    if (obj.displayCode) return String(obj.displayCode);
    if (obj.city) return String(obj.city);
    if (obj.code) return String(obj.code);
  }
  return "";
}

// Interface simples para leg
interface LegData {
  origin?: {
    city?: { displayCode?: string; name?: string };
    displayCode?: string;
    name?: string;
  };
  destination?: {
    city?: { displayCode?: string; name?: string };
    displayCode?: string;
    name?: string;
  };
  departure?: unknown;
  arrival?: unknown;
  durationMinutes?: number;
  marketingCarrier?: { name?: string };
  flightNumber?: string;
  stopCount?: number;
  segments?: LegData[];
}

// Helper to convert date object to formatted string
function formatDateTime(dateObj: unknown) {
  if (!dateObj) return "";
  
  // Se é uma string, tenta fazer parse direto
  if (typeof dateObj === "string") {
    return new Date(dateObj).toLocaleString("pt-BR");
  }
  
  // Se é um objeto com year, month, day, hour, minute
  if (typeof dateObj === "object" && dateObj !== null) {
    const obj = dateObj as Record<string, unknown>;
    if (obj.year && obj.month && obj.day) {
      const date = new Date(
        Number(obj.year),
        Number(obj.month) - 1, // month é 0-indexed no JavaScript
        Number(obj.day),
        Number(obj.hour) || 0,
        Number(obj.minute) || 0
      );
      return date.toLocaleString("pt-BR");
    }
  }
  
  return "";
}

export default function RoundTripFlightDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [flightDetailsIda, setFlightDetailsIda] = useState<unknown>(null);
  const [flightDetailsVolta, setFlightDetailsVolta] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ida" | "volta">("ida");

  useEffect(() => {
    const { vooIda, vooVolta, token } = location.state || {};
    
    if (!vooIda || !vooVolta) {
      toast.error("Dados dos voos não encontrados");
      navigate("/resultados-ida-volta");
      return;
    }

    // Buscar detalhes do voo de ida
    const bodyIda = {
      token: token || "",
      itineraryId: vooIda.id || vooIda.itineraryId || ""
    };

    // Buscar detalhes do voo de volta
    const bodyVolta = {
      token: token || "",
      itineraryId: vooVolta.id || vooVolta.itineraryId || ""
    };

    Promise.all([
      FlightService.getFlighDetails(bodyIda).catch(() => null),
      FlightService.getFlighDetails(bodyVolta).catch(() => null)
    ])
    .then(([resIda, resVolta]) => {
      setFlightDetailsIda(resIda);
      setFlightDetailsVolta(resVolta);
    })
    .finally(() => setLoading(false));
  }, [location.state, navigate]);

  const handleReserveFlight = () => {
    navigate("/checkout", {
      state: {
        vooIda: location.state?.vooIda,
        vooVolta: location.state?.vooVolta,
        flightDetailsIda,
        flightDetailsVolta
      }
    });
  };

  const handleBack = () => {
    navigate("/resultados-ida-volta");
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <RoundTripFlightDetailsSkeleton />;
  
  if (!flightDetailsIda && !flightDetailsVolta) {
    return <div className="text-center py-20 text-red-500">Não foi possível carregar os detalhes dos voos.</div>;
  }

  // Função para renderizar detalhes de um voo
  const renderFlightDetails = (flightDetails: unknown, tipo: "ida" | "volta") => {
    const details = flightDetails as { data?: { itinerary?: unknown } };
    if (!flightDetails || !details.data || !details.data.itinerary) {
      return <div className="text-center py-10 text-red-500">Detalhes do voo de {tipo} não disponíveis.</div>;
    }

    const itinerary = details.data.itinerary as { legs?: LegData[]; pricingOptions?: unknown[] };
    const firstLeg = itinerary.legs?.[0];
    const lastLeg = itinerary.legs?.[itinerary.legs.length - 1];

    console.log(firstLeg)
    // Extração dos dados
    const origem = getString(firstLeg?.origin?.city);
    const origemCodigo = firstLeg?.origin?.city?.displayCode;
    const destino = getString(lastLeg?.destination?.city);
    const destinoCodigo = lastLeg?.destination?.city?.displayCode;
    const dataPartida = formatDateTime(firstLeg?.departure);
    const dataChegada = formatDateTime(lastLeg?.arrival);
    const duracao = firstLeg?.durationMinutes !== undefined ? `${Math.floor(firstLeg.durationMinutes / 60)}h ${firstLeg.durationMinutes % 60}min` : "";
    const paradas = firstLeg?.stopCount ?? 0;
    const tipoVoo = paradas === 0 ? "Voo direto" : `${paradas} parada${paradas > 1 ? 's' : ''}`;
    
    // Preço e bagagem
    const firstPricingOption = itinerary.pricingOptions?.[0] as { pricingItems?: unknown[] };
    const firstPricingItem = firstPricingOption?.pricingItems?.[0] as { 
      price?: { amount?: string; unit?: string }; 
      fare?: { cabinBaggage?: string; checkedBaggage?: string } 
    };
    const priceData = firstPricingItem?.price;
    const preco = priceData ? (parseInt(priceData.amount || "0") / (priceData.unit === "UNIT_CENTI" ? 100 : 1)) : null;
    const bagagem = firstPricingItem?.fare?.cabinBaggage || firstPricingItem?.fare?.checkedBaggage || "Consultar regras";

    return (
      <div className="space-y-6">
        {/* Rota do voo completa - com todas as escalas */}
        <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">

          {/* Renderizar ida e volta separadamente */}
          {itinerary.legs && itinerary.legs.length > 0 ? (
            <div className="space-y-6">
              {itinerary.legs.map((leg: LegData & { segments?: LegData[] }, legIndex: number) => (
                <div key={legIndex} className="space-y-4">
                  {/* Título da direção (Ida/Volta) */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-econotrip-blue/10 rounded-full">
                      <Plane className={`h-4 w-4 text-econotrip-blue ${legIndex === 1 ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium text-econotrip-blue">
                        {legIndex === 0 ? 'Voo de Ida' : 'Voo de Volta'}
                      </span>
                    </div>
                  </div>

                  {/* Renderizar segmentos da ida/volta */}
                  {leg.segments && leg.segments.length > 0 ? (
                    leg.segments.map((segment: LegData, segmentIndex: number) => {
                      const segOrigemCodigo = segment?.origin?.city?.displayCode || segment?.origin?.displayCode;
                      const segDestinoCodigo = segment?.destination?.city?.displayCode || segment?.destination?.displayCode;
                      const segOrigem = getString(segment?.origin?.city) || getString(segment?.origin);
                      const segDestino = getString(segment?.destination?.city) || getString(segment?.destination);
                      const segPartida = formatDateTime(segment?.departure);
                      const segChegada = formatDateTime(segment?.arrival);
                      const segDuracao = segment?.durationMinutes !== undefined ? `${Math.floor(segment.durationMinutes / 60)}h ${segment.durationMinutes % 60}min` : "";
                      const companhiaAerea = segment?.marketingCarrier?.name || "Companhia não informada";
                      const numeroVoo = segment?.flightNumber || "";
                      
                      // Calcular tempo de escala
                      const nextSegment = leg.segments![segmentIndex + 1];
                      let tempoEscala = "";
                      if (nextSegment && segment?.arrival && nextSegment?.departure) {
                        console.log('Calculando escala:', {
                          chegada: segment.arrival,
                          partida: nextSegment.departure,
                          segmento: segmentIndex
                        });
                        
                        let chegadaDate: Date | null = null;
                        let partidaDate: Date | null = null;
                        
                        // Tentar diferentes formatos de data
                        try {
                          // Se for string, tentar parse direto
                          if (typeof segment.arrival === "string") {
                            chegadaDate = new Date(segment.arrival);
                          } else if (typeof segment.arrival === "object" && segment.arrival !== null) {
                            const arrObj = segment.arrival as Record<string, unknown>;
                            if (arrObj.year && arrObj.month && arrObj.day) {
                              chegadaDate = new Date(
                                Number(arrObj.year),
                                Number(arrObj.month) - 1,
                                Number(arrObj.day),
                                Number(arrObj.hour) || 0,
                                Number(arrObj.minute) || 0
                              );
                            }
                          }
                          
                          // Se for string, tentar parse direto
                          if (typeof nextSegment.departure === "string") {
                            partidaDate = new Date(nextSegment.departure);
                          } else if (typeof nextSegment.departure === "object" && nextSegment.departure !== null) {
                            const depObj = nextSegment.departure as Record<string, unknown>;
                            if (depObj.year && depObj.month && depObj.day) {
                              partidaDate = new Date(
                                Number(depObj.year),
                                Number(depObj.month) - 1,
                                Number(depObj.day),
                                Number(depObj.hour) || 0,
                                Number(depObj.minute) || 0
                              );
                            }
                          }
                          
                          console.log('Datas processadas:', { chegadaDate, partidaDate });
                          
                          if (chegadaDate && partidaDate && !isNaN(chegadaDate.getTime()) && !isNaN(partidaDate.getTime())) {
                            const diffMinutes = Math.floor((partidaDate.getTime() - chegadaDate.getTime()) / (1000 * 60));
                            console.log('Diferença em minutos:', diffMinutes);
                            
                            if (diffMinutes > 0) {
                              const hours = Math.floor(diffMinutes / 60);
                              const minutes = diffMinutes % 60;
                              tempoEscala = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
                              console.log('Tempo de escala calculado:', tempoEscala);
                            }
                          }
                        } catch (error) {
                          console.error('Erro ao calcular tempo de escala:', error);
                        }
                      }
                      
                      return (
                        <React.Fragment key={`${legIndex}-${segmentIndex}`}>
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            {/* Header do segmento */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-econotrip-blue">
                                {leg.segments!.length > 1 ? `Trecho ${segmentIndex + 1}` : 'Voo direto'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {companhiaAerea} {numeroVoo}
                              </span>
                            </div>
                            
                            {/* Rota visual do segmento */}
                            <div className="flex items-start space-x-2 mb-3">
                              <div className="flex flex-col items-center min-w-0 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl mb-1 flex items-center justify-center shadow">
                                  <span className="font-bold text-sm text-white">{segOrigemCodigo}</span>
                                </div>
                                <p className="text-xs text-gray-600 text-center truncate w-full">{segOrigem}</p>
                                <p className="text-xs text-gray-500 text-center">{segPartida}</p>
                              </div>
                              
                              <div className="flex flex-col items-center px-2 min-w-0">
                                <div className="h-12 flex items-center justify-center relative mb-1">
                                  <div className="border-t-2 border-dashed border-econotrip-orange/50 w-12 absolute top-1/2"></div>
                                  <div className="w-6 h-6 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center relative z-10">
                                    <Plane className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 text-center">{segDuracao}</p>
                              </div>
                              
                              <div className="flex flex-col items-center min-w-0 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl mb-1 flex items-center justify-center shadow">
                                  <span className="font-bold text-sm text-white">{segDestinoCodigo}</span>
                                </div>
                                <p className="text-xs text-gray-600 text-center truncate w-full">{segDestino}</p>
                                <p className="text-xs text-gray-500 text-center">{segChegada}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Indicador de escala entre trechos */}
                          {segmentIndex < leg.segments!.length - 1 && (
                            <div className="flex items-center justify-center py-1">
                              <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                                <Clock className="h-4 w-4 text-amber-600" />
                                <div className="text-center">
                                  <p className="text-sm font-medium text-amber-700">Escala em {segDestino}</p>
                                  {tempoEscala ? (
                                    <p className="text-xs text-amber-600">Tempo de conexão: {tempoEscala}</p>
                                  ) : (
                                    <p className="text-xs text-amber-600">Tempo de conexão: Verificar horários</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    // Fallback para quando não há segments, usar o leg diretamente
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-econotrip-blue">Voo direto</span>
                      </div>
                      
                      <div className="flex items-start space-x-2 mb-3">
                        <div className="flex flex-col items-center min-w-0 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl mb-1 flex items-center justify-center shadow">
                            <span className="font-bold text-sm text-white">
                              {leg?.origin?.city?.displayCode || leg?.origin?.displayCode}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full">
                            {getString(leg?.origin?.city) || getString(leg?.origin)}
                          </p>
                          <p className="text-xs text-gray-500 text-center">{formatDateTime(leg?.departure)}</p>
                        </div>
                        
                        <div className="flex flex-col items-center px-2 min-w-0">
                          <div className="h-12 flex items-center justify-center relative mb-1">
                            <div className="border-t-2 border-dashed border-econotrip-orange/50 w-12 absolute top-1/2"></div>
                            <div className="w-6 h-6 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center relative z-10">
                              <Plane className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            {leg?.durationMinutes !== undefined ? `${Math.floor(leg.durationMinutes / 60)}h ${leg.durationMinutes % 60}min` : ""}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-center min-w-0 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl mb-1 flex items-center justify-center shadow">
                            <span className="font-bold text-sm text-white">
                              {leg?.destination?.city?.displayCode || leg?.destination?.displayCode}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 text-center truncate w-full">
                            {getString(leg?.destination?.city) || getString(leg?.destination)}
                          </p>
                          <p className="text-xs text-gray-500 text-center">{formatDateTime(leg?.arrival)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">Informações de rota não disponíveis</div>
          )}
        </div>

        {/* Detalhes do voo */}
        <div className="space-y-4">
          <motion.div
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-econotrip-blue/10 to-econotrip-blue/5 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-econotrip-blue text-lg">Data e Duração</p>
              <p className="text-gray-700">{dataPartida} • {duracao}</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-econotrip-blue text-lg">Tipo de Voo</p>
              <p className="text-gray-700">{tipoVoo}</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center flex-shrink-0">
              <Luggage className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-econotrip-blue text-lg">Bagagem incluída</p>
              <p className="text-gray-700">{bagagem}</p>
            </div>
          </motion.div>
        </div>

        {/* Opções de compra */}
        <motion.div
          variants={itemAnimation}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          className="mt-8 border-t border-gray-200 pt-8"
        >
          <div className="mb-6 p-1 rounded-2xl">
            <p className="font-semibold text-econotrip-blue text-lg mb-3">Opções de compra</p>
            {itinerary.pricingOptions && itinerary.pricingOptions.length > 0 ? (
              itinerary.pricingOptions.slice(0, 3).map((pricingOption: unknown, pricingIdx: number) => (
                <div key={pricingIdx} className="mb-4">
                  {(pricingOption as { pricingItems?: unknown[] })?.pricingItems && (pricingOption as { pricingItems?: unknown[] }).pricingItems!.length > 0 ? (pricingOption as { pricingItems?: unknown[] }).pricingItems!.map((pricingItem: unknown, itemIdx: number) => {
                    const item = pricingItem as {
                      agent?: { name?: string; rating?: { value?: number; count?: number }; partnerMessages?: { text?: string }[] };
                      price?: { amount?: string; unit?: string };
                      uri?: string;
                    };
                    const agent = item.agent;
                    const price = item.price;
                    const priceValue = price ? (parseInt(price.amount || "0") / (price.unit === "UNIT_CENTI" ? 100 : 1)) : null;
                    
                    return (
                      <div key={itemIdx} className="mb-4 p-4 bg-white rounded-xl shadow">
                        <div className="mb-3">
                          <div className="font-bold text-econotrip-orange text-lg">
                            {priceValue ? `R$ ${priceValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Preço indisponível"}
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            {agent?.name ? `Agência: ${agent.name}` : "Agência não informada"}
                          </div>
                          {agent?.rating && (
                            <div className="text-xs text-gray-600 mt-1">
                              ⭐ {agent.rating.value}/5 ({agent.rating.count} avaliações)
                            </div>
                          )}
                          {agent?.partnerMessages && agent.partnerMessages.length > 0 && (
                            <div className="text-xs text-blue-600 mt-1">
                              {agent.partnerMessages[0].text}
                            </div>
                          )}
                        </div>
                        {item.uri && (
                          <a
                            href={item.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full px-5 py-3 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 text-white font-semibold rounded-xl shadow hover:from-econotrip-blue/90 hover:to-econotrip-blue transition-all text-center"
                          >
                            Comprar
                          </a>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="text-gray-500">Nenhuma opção de preço encontrada.</div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500">Nenhuma opção de compra disponível.</div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-2 py-2 pb-32">
        {/* Header */}
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
              Detalhes da Viagem
            </h1>
            <p className="text-gray-600">
              Ida e volta - Todas as informações dos seus voos
            </p>
          </div>
        </motion.div>
        {/* Cartão principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-6 p-1 rounded-3xl shadow-xl bg-white/95 backdrop-blur-sm border-0">
            {activeTab === "ida" ? renderFlightDetails(flightDetailsIda, "ida") : renderFlightDetails(flightDetailsVolta, "volta")}
          </Card>
        </motion.div>

        {/* Botão de ajuda flutuante */}
        <div className="fixed bottom-32 right-6 z-40">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 shadow-xl flex items-center justify-center text-white hover:shadow-2xl transition-all"
                  aria-label="Ajuda rápida"
                >
                  <HelpCircle className="h-7 w-7" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Ajuda rápida</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
