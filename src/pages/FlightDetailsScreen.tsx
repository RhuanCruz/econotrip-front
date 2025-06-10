
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility, ArrowLeft, HelpCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  return (
    <LayoutBase>
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-32">
        {/* Header com Back Button corrigido */}
        <div className="flex items-center mb-6">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={handleBack}
            className="mr-3 flex-shrink-0"
            aria-label="Voltar para resultados"
          />
          <div className="flex items-center min-w-0">
            <Plane className="h-6 w-6 text-econotrip-orange mr-3 flex-shrink-0" />
            <h1 className="text-xl font-semibold text-econotrip-blue truncate">
              Detalhes do Voo
            </h1>
          </div>
        </div>

        {/* Cartão principal */}
        <Card className="mb-6 p-6 rounded-2xl shadow-md">
          {/* Rota do voo */}
          <div className="flex flex-col mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mb-1 flex items-center justify-center">
                  <span className="font-bold text-sm text-econotrip-blue">{flightDetails.originCode}</span>
                </div>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300 relative h-6">
                <Plane className="h-5 w-5 text-econotrip-orange absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full mb-1 flex items-center justify-center">
                  <span className="font-bold text-sm text-econotrip-orange">{flightDetails.destinationCode}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-2">
              <div className="text-center">
                <h3 className="font-semibold text-econotrip-blue text-lg">{flightDetails.origin}</h3>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-econotrip-blue text-lg">{flightDetails.destination}</h3>
              </div>
            </div>
          </div>
          
          {/* Detalhes do voo */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Clock className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Data e Duração</p>
                <p className="text-gray-700">{flightDetails.date} • {flightDetails.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Plane className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Tipo de Voo</p>
                <p className="text-gray-700">{flightDetails.stops}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Luggage className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Bagagem incluída</p>
                <p className="text-gray-700">{flightDetails.baggage}</p>
              </div>
            </div>

            {flightDetails.isLowEmission && (
              <div className="flex items-center gap-4 p-4 bg-econotrip-green/10 rounded-xl">
                <Leaf className="h-6 w-6 text-econotrip-green flex-shrink-0" />
                <div>
                  <p className="font-medium text-econotrip-green">Emissão de carbono</p>
                  <p className="text-gray-700">Baixa emissão de carbono</p>
                </div>
              </div>
            )}

            {flightDetails.isAccessible && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Accessibility className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
                <div>
                  <p className="font-medium text-econotrip-blue">Acessibilidade</p>
                  <p className="text-gray-700">Assentos preferenciais e assistência no embarque</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Shield className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Política de cancelamento</p>
                <p className="text-gray-700">{flightDetails.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          {/* Seção de preço */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-lg mb-2">Preço por pessoa</p>
              <p className="text-3xl font-bold text-econotrip-orange">
                R$ {flightDetails.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Botão de ajuda flutuante corrigido */}
        <div className="fixed bottom-32 right-6 z-40">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-12 w-12 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Ajuda rápida"
                >
                  <HelpCircle className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Ajuda rápida</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Botão fixo no bottom corrigido */}
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-md z-30">
          <div className="max-w-screen-sm mx-auto">
            <Button
              variant="primary"
              size="lg"
              icon={Check}
              onClick={handleReserveFlight}
              className="w-full bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 text-white text-lg rounded-xl h-14"
            >
              Reservar este voo
            </Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
}
