import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility, ArrowLeft, HelpCircle, Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { FlightService } from "@/api/flight/FlightService";
import { FlightDetailsSkeleton } from "@/components/ui-custom/FlightDetailsSkeleton";

export default function FlightDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(0);

  useEffect(() => {
    const searchData = location.state?.searchData;
    console.log("Search Data:", searchData);
    if (!searchData) return;
    const body = {
      token: searchData.token,
      itineraryId: searchData.itineraryId,
    };
    FlightService.getFlighDetails(body)
      .then((res) => setFlightDetails(res))
      .catch(() => setFlightDetails(null))
      .finally(() => setLoading(false));
  }, [location.state]);

  const handleReserveFlight = () => {
    navigate("/checkout");
  };

  type DateObject = {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
  };

  function formatDateTime(dateObj: string | DateObject | null | undefined): string {
    if (!dateObj) return "";

    // Se é uma string, tenta fazer parse direto
    if (typeof dateObj === "string") {
      return new Date(dateObj).toLocaleString("pt-BR");
    }

    // Se é um objeto com year, month, day, hour, minute
    if (typeof dateObj === "object" && dateObj.year && dateObj.month && dateObj.day) {
      const date = new Date(
        dateObj.year,
        dateObj.month - 1, // month é 0-indexed no JavaScript
        dateObj.day,
        dateObj.hour || 0,
        dateObj.minute || 0
      );
      return date.toLocaleString("pt-BR");
    }

    return "";
  }

    function formatDate(dateObj: string | DateObject | null | undefined): string {
    if (!dateObj) return "";

    // Se é uma string, tenta fazer parse direto
    if (typeof dateObj === "string") {
      return new Date(dateObj).toLocaleString("pt-BR");
    }

    // Se é um objeto com year, month, day, hour, minute
    if (typeof dateObj === "object" && dateObj.year && dateObj.month && dateObj.day) {
      const date = new Date(
        dateObj.year,
        dateObj.month - 1,
        dateObj.day,
      );
      return date.toLocaleString("pt-BR", { day: '2-digit', month: '2-digit', year: '2-digit'});
    }

    return "";
  }

  const handleBack = () => {
    navigate("/resultados-voos");
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) return <FlightDetailsSkeleton />;
  if (!flightDetails || !flightDetails.data || !flightDetails.data.itinerary) return <div className="text-center py-20 text-red-500">Não foi possível carregar os detalhes do voo.</div>;

  // Extrai dados do novo retorno (GetFlightDetailResponse)
  const itinerary = flightDetails.data.itinerary;
  const firstLeg = itinerary.legs?.[0];
  const lastLeg = itinerary.legs?.[itinerary.legs.length - 1];

  // Corrige possíveis objetos sendo renderizados como string
  const origem = firstLeg?.origin?.city?.name;
  const origemCodigo = firstLeg?.origin?.city?.displayCode;
  const destino = lastLeg?.destination?.city?.name;
  const destinoCodigo = lastLeg?.destination?.city?.displayCode;

  const dataPartida = firstLeg?.departure ? formatDateTime(firstLeg.departure): "";
  const dataChegada = lastLeg?.arrival ? formatDateTime(lastLeg.arrival) : "";

  const duracao = firstLeg?.durationMinutes !== undefined ? `${Math.floor(firstLeg.durationMinutes / 60)}h ${firstLeg.durationMinutes % 60}min` : "";
  const paradas = firstLeg?.stopCount ?? 0;
  const tipoVoo = paradas === 0 ? "Voo direto" : `${paradas} parada${paradas > 1 ? 's' : ''}`;
  // Preço e bagagem podem estar em pricingOptions/pricingItems
  const firstPricingItem = itinerary.pricingOptions?.[0]?.pricingItems?.[0];
  const priceData = firstPricingItem?.price;
  const preco = priceData ? (parseInt(priceData.amount) / (priceData.unit === "UNIT_CENTI" ? 100 : 1)) : null;
  const bagagem = firstPricingItem?.fare?.cabinBaggage || firstPricingItem?.fare?.checkedBaggage || "Consultar regras";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-32">
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
              className="w-16 h-16 bg-econotrip-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Plane className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Detalhes do Voo
            </h1>
            <p className="text-gray-600">
              Todas as informações da sua viagem
            </p>
          </div>
        </motion.div>

        {/* Cartão principal moderno */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6 p-1 rounded-3xl shadow-xl bg-white/95 backdrop-blur-sm border-0">
            {/* Seletor de trecho (ida/volta) - visual igual ao ModernFlightSearchForm */}
            {Array.isArray(flightDetails.selected_flights) && flightDetails.selected_flights.length > 1 && (
              <div className="bg-white rounded-2xl p-2 shadow mb-6">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setSelectedFlightIndex(0)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${selectedFlightIndex === 0
                        ? 'bg-white text-econotrip-blue shadow-sm'
                        : 'text-gray-600'
                      }`}
                  >
                    Ida
                  </button>
                  <button
                    onClick={() => setSelectedFlightIndex(1)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${selectedFlightIndex === 1
                        ? 'bg-white text-econotrip-blue shadow-sm'
                        : 'text-gray-600'
                      }`}
                  >
                    Volta
                  </button>
                </div>
              </div>
            )}
            {/* Rota do voo moderna */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl mb-2 flex items-center justify-center shadow-lg">
                    <span className="font-bold text-lg text-white">{origemCodigo}</span>
                  </div>
                </div>
                <div className="flex-1 relative flex items-center">
                  <div className="border-t-2 border-dashed border-econotrip-orange/50 w-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center shadow-lg">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl mb-2 flex items-center justify-center shadow-lg">
                    <span className="font-bold text-lg text-white">{destinoCodigo}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col px-4 gap-4">
                <div className="text-center">
                  <h3 className="font-bold text-econotrip-blue text-base sm:text-lg">{origem}</h3>
                  <p className="text-gray-600 text-sm">Origem ({origemCodigo})</p>
                  <p className="text-xs text-gray-500 mt-1">{dataPartida}</p>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-econotrip-blue text-base sm:text-lg">{destino}</h3>
                  <p className="text-gray-600 text-sm">Destino ({destinoCodigo})</p>
                  <p className="text-xs text-gray-500 mt-1">{dataChegada}</p>
                </div>
              </div>
            </div>

            {/* Detalhes do voo modernos */}
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

              {flightDetails.isLowEmission && (
                <motion.div
                  variants={itemAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 rounded-2xl border border-econotrip-green/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-econotrip-green text-lg">Emissão de carbono</p>
                    <p className="text-gray-700">Baixa emissão de carbono</p>
                  </div>
                </motion.div>
              )}

              {flightDetails.isAccessible && (
                <motion.div
                  variants={itemAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Accessibility className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-econotrip-blue text-lg">Acessibilidade</p>
                    <p className="text-gray-700">Assentos preferenciais e assistência no embarque</p>
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={itemAnimation}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-econotrip-blue text-lg">Política de cancelamento</p>
                  <p className="text-gray-700">{flightDetails.cancellationPolicy ? flightDetails.cancellationPolicy : "Não informado"}</p>
                </div>
              </motion.div>
            </div>

            {/* Seção de preço moderna */}
            <motion.div
              variants={itemAnimation}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
              className="mt-8 border-t border-gray-200 pt-8"
            >
              <div className="mb-6 p-2 rounded-2xl">
                <p className="font-semibold text-econotrip-blue text-lg mb-3">Opções de compra</p>
                {itinerary.pricingOptions && itinerary.pricingOptions.length > 0 ? (
                  itinerary.pricingOptions.map((pricingOption, pricingIdx) => (
                    <div key={pricingIdx} className="mb-4">
                      {pricingOption.pricingItems && pricingOption.pricingItems.length > 0 ? pricingOption.pricingItems.map((pricingItem, itemIdx) => {
                        const agent = pricingItem.agent;
                        const price = pricingItem.price;
                        const priceValue = price ? (parseInt(price.amount) / (price.unit === "UNIT_CENTI" ? 100 : 1)) : null;
                        
                        return (
                          <div key={itemIdx} className="mb-4 p-4 bg-white rounded-xl shadow">
                            <div className="mb-3">
                              <div className="font-bold text-econotrip-blue-light text-lg">
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
                              {/* {agent?.partnerMessages && agent.partnerMessages.length > 0 && (
                                <div className="text-xs text-blue-600 mt-1">
                                  {agent.partnerMessages[0].text}
                                </div>
                              )} */}
                            </div>
                            {pricingItem.uri && (
                              <a
                                href={pricingItem.uri}
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
          </Card>
        </motion.div>

        {/* Botão de ajuda flutuante moderno */}
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

        {/* Botão fixo no bottom moderno */}
        {/*
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-xl z-30">
          <div className="max-w-screen-sm mx-auto">
            <Button
              onClick={handleReserveFlight}
              className="w-full bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 hover:from-econotrip-orange/90 hover:to-econotrip-orange text-white text-xl font-semibold rounded-2xl h-16 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Check className="mr-3 h-6 w-6" />
              Reservar este voo
            </Button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
