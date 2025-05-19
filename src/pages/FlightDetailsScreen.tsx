
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility, ArrowLeft, HelpCircle, Check } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock flight data that would normally be passed via location state
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
  
  // In a real app, we would get the flight details from the location state
  // const flightId = location.state?.flightId;
  // For now we'll use the mock data
  const flightDetails = mockFlightDetails;

  const handleReserveFlight = () => {
    // In a real app, this would navigate to the checkout screen
    // navigate("/checkout", { state: { flightId: flightDetails.id } });
    toast.success("Reserva iniciada! Checkout em implementação.");
    console.log("Reserving flight:", flightDetails.id);
  };

  const handleBack = () => {
    navigate("/resultados-voos");
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto relative pb-24">
        {/* Modern Header with Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="mr-3 touch-target p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Voltar para resultados"
          >
            <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
          </button>
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-econotrip-orange mr-3" />
            <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
              Detalhes do Voo
            </h1>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          {/* Origin-Destination Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
                    <span className="font-bold text-xs">BR</span>
                  </div>
                  <span className="text-xs font-medium">{flightDetails.originCode}</span>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-gray-300 relative h-6">
                  <Plane className="h-5 w-5 text-econotrip-blue absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
                    <span className="font-bold text-xs">PT</span>
                  </div>
                  <span className="text-xs font-medium">{flightDetails.destinationCode}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between px-2">
                <div className="text-center">
                  <h3 className="font-medium text-econotrip-blue">{flightDetails.origin}</h3>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-econotrip-blue">{flightDetails.destination}</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Flight Details */}
          <div className="space-y-6 text-lg">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Clock className="h-6 w-6 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Data e Duração</p>
                <p className="text-gray-700">{flightDetails.date} • {flightDetails.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Plane className="h-6 w-6 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Tipo de Voo</p>
                <p className="text-gray-700">{flightDetails.stops}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Luggage className="h-6 w-6 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Bagagem incluída</p>
                <p className="text-gray-700">{flightDetails.baggage}</p>
              </div>
            </div>

            {flightDetails.isLowEmission && (
              <div className="flex items-center gap-4 p-3 bg-econotrip-green/10 rounded-xl">
                <Leaf className="h-6 w-6 text-econotrip-green" />
                <div>
                  <p className="font-medium text-econotrip-green">Emissão de carbono</p>
                  <p className="text-gray-700">Baixa emissão de carbono</p>
                </div>
              </div>
            )}

            {flightDetails.isAccessible && (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <Accessibility className="h-6 w-6 text-econotrip-blue" />
                <div>
                  <p className="font-medium text-econotrip-blue">Acessibilidade</p>
                  <p className="text-gray-700">Assentos preferenciais e assistência no embarque</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Shield className="h-6 w-6 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Política de cancelamento</p>
                <p className="text-gray-700">{flightDetails.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-10 border-t border-gray-200 pt-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-lg mb-2">Preço por pessoa</p>
              <p className="text-4xl md:text-5xl font-bold text-econotrip-orange">
                R$ {flightDetails.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* "Voltar para resultados" button */}
            <div className="flex justify-center mt-8">
              <Button
                variant="secondary"
                onClick={handleBack}
                icon={ArrowLeft}
                iconPosition="left"
                className="text-lg"
              >
                Voltar para resultados
              </Button>
            </div>
          </div>
        </Card>

        {/* Floating Help Button */}
        <div className="fixed bottom-24 right-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Ajuda rápida"
                >
                  <HelpCircle className="h-7 w-7" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Ajuda rápida</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Fixed Bottom CTA Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="primary"
              size="lg"
              icon={Check}
              onClick={handleReserveFlight}
              className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-xl h-16"
            >
              Reservar este voo
            </Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
}
