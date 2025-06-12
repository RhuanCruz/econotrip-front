
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility, ArrowLeft, HelpCircle, Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

const mockFlightDetails = {
  id: "flight-1",
  origin: "São Paulo",
  originCode: "GRU",
  destination: "Lisboa",
  destinationCode: "LIS",
  date: "10/03/2024",
  duration: "10h 25min",
  stops: "Voo direto",
  baggage: "1 mala de 23kg + 1 item pessoal",
  price: 2350.0,
  isLowEmission: true,
  isAccessible: true,
  cancellationPolicy: "Cancelamento gratuito até 48h antes",
};

export default function FlightDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const flightDetails = mockFlightDetails;

  const handleReserveFlight = () => {
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate("/resultados-voos");
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
              className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
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
          <Card className="mb-6 p-6 rounded-3xl shadow-xl bg-white/95 backdrop-blur-sm border-0">
            {/* Rota do voo moderna */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl mb-2 flex items-center justify-center shadow-lg">
                    <span className="font-bold text-lg text-white">{flightDetails.originCode}</span>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="border-t-2 border-dashed border-econotrip-orange/50 relative h-8">
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-full flex items-center justify-center shadow-lg">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-2xl mb-2 flex items-center justify-center shadow-lg">
                    <span className="font-bold text-lg text-white">{flightDetails.destinationCode}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between px-4">
                <div className="text-center">
                  <h3 className="font-bold text-econotrip-blue text-xl">{flightDetails.origin}</h3>
                  <p className="text-gray-600">Origem</p>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-econotrip-blue text-xl">{flightDetails.destination}</h3>
                  <p className="text-gray-600">Destino</p>
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
                  <p className="text-gray-700">{flightDetails.date} • {flightDetails.duration}</p>
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
                  <p className="text-gray-700">{flightDetails.stops}</p>
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
                  <p className="text-gray-700">{flightDetails.baggage}</p>
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
                  <p className="text-gray-700">{flightDetails.cancellationPolicy}</p>
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
              <div className="text-center mb-6 p-6 bg-gradient-to-r from-econotrip-orange/10 to-econotrip-orange/5 rounded-2xl">
                <p className="text-gray-600 text-lg mb-3">Preço total por pessoa</p>
                <p className="text-4xl font-bold text-econotrip-orange">
                  R$ {flightDetails.price.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-2">Taxas incluídas</p>
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
      </div>
    </div>
  );
}
