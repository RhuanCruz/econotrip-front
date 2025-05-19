
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility } from "lucide-react";
import { toast } from "sonner";

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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-museomoderno font-bold text-econotrip-blue mb-8">
          Detalhes do Voo
        </h1>

        <Card className="mb-8 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-medium text-econotrip-blue">
                  {flightDetails.origin} ({flightDetails.originCode})
                </h2>
                <span className="text-gray-500">→</span>
                <h2 className="text-2xl font-medium text-econotrip-blue">
                  {flightDetails.destination} ({flightDetails.destinationCode})
                </h2>
              </div>
              <p className="text-gray-600 mt-2">Data: {flightDetails.date}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Duração</p>
                <p>{flightDetails.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Plane className="h-5 w-5 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Escalas</p>
                <p>{flightDetails.stops}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Luggage className="h-5 w-5 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Bagagem incluída</p>
                <p>{flightDetails.baggage}</p>
              </div>
            </div>

            {flightDetails.isLowEmission && (
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-econotrip-green" />
                <div>
                  <p className="font-medium text-econotrip-green">Emissão de carbono</p>
                  <p>Baixa emissão de carbono</p>
                </div>
              </div>
            )}

            {flightDetails.isAccessible && (
              <div className="flex items-center gap-3">
                <Accessibility className="h-5 w-5 text-econotrip-blue" />
                <div>
                  <p className="font-medium text-econotrip-blue">Acessibilidade</p>
                  <p>Assentos preferenciais e assistência no embarque</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-econotrip-blue" />
              <div>
                <p className="font-medium text-econotrip-blue">Política de cancelamento</p>
                <p>{flightDetails.cancellationPolicy}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm mb-1">Preço por pessoa</p>
              <p className="text-3xl md:text-4xl font-bold text-econotrip-orange">
                R$ {flightDetails.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleReserveFlight}
                className="w-full md:w-auto"
              >
                Reservar este voo
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleBack}>
            Voltar para resultados
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
}
