
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Plane, Clock, Luggage, Shield, Leaf, Accessibility } from "lucide-react";

import { ScreenHeader } from "./components/ScreenHeader";
import { FlightPath } from "./components/FlightPath";
import { DetailItem } from "./components/DetailItem";
import { PriceSection } from "./components/PriceSection";
import { ActionButtons } from "./components/ActionButtons";
import { FlightDetails } from "./model/types";

// Mock flight data that would normally be passed via location state
const mockFlightDetails: FlightDetails = {
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
  
  // In a real app, we would get the flight details from the location state
  // const flightId = location.state?.flightId;
  // For now we'll use the mock data
  const flightDetails = mockFlightDetails;

  const handleReserveFlight = () => {
    // Navigate to the checkout screen
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate("/resultados-voos");
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto relative pb-24">
        {/* Header with Back Button */}
        <ScreenHeader onBack={handleBack} />

        {/* Main Content Card */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          {/* Origin-Destination Section */}
          <FlightPath 
            origin={flightDetails.origin}
            originCode={flightDetails.originCode}
            destination={flightDetails.destination}
            destinationCode={flightDetails.destinationCode}
          />
          
          {/* Flight Details */}
          <div className="space-y-6 text-lg">
            <DetailItem
              icon={Clock}
              title="Data e Duração"
              value={`${flightDetails.date} • ${flightDetails.duration}`}
            />
            
            <DetailItem
              icon={Plane}
              title="Tipo de Voo"
              value={flightDetails.stops}
            />
            
            <DetailItem
              icon={Luggage}
              title="Bagagem incluída"
              value={flightDetails.baggage}
            />
            
            {flightDetails.isLowEmission && (
              <DetailItem
                icon={Leaf}
                title="Emissão de carbono"
                value="Baixa emissão de carbono"
                variant="success"
              />
            )}
            
            {flightDetails.isAccessible && (
              <DetailItem
                icon={Accessibility}
                title="Acessibilidade"
                value="Assentos preferenciais e assistência no embarque"
              />
            )}
            
            <DetailItem
              icon={Shield}
              title="Política de cancelamento"
              value={flightDetails.cancellationPolicy}
            />
          </div>

          {/* Price Section */}
          <PriceSection 
            price={flightDetails.price} 
            onBack={handleBack} 
          />
        </Card>

        {/* Action Buttons */}
        <ActionButtons onReserve={handleReserveFlight} />
      </div>
    </LayoutBase>
  );
}
