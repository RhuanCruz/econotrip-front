
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutHeader } from "./components/CheckoutHeader";
import { FlightSummary } from "./components/FlightSummary";
import { PassengerInfo } from "./components/PassengerInfo";
import { ImportantNotices } from "./components/ImportantNotices";
import { CheckoutActions } from "./components/CheckoutActions";
import { mockPassengerData, mockFlightData } from "./data/mockData";

export default function CheckoutScreen() {
  const navigate = useNavigate();

  const handleFinishPurchase = () => {
    // Navigate to the confirmation screen
    navigate("/confirmacao");
  };

  const handleBack = () => {
    navigate("/detalhes-voo");
  };

  return (
    <div className="max-w-5xl mx-auto relative pb-24">
      {/* Header with Back Button */}
      <CheckoutHeader onBackClick={handleBack} />

      {/* Flight Summary Card */}
      <FlightSummary flightData={mockFlightData} />

      {/* Passenger Information Card */}
      <PassengerInfo passengerData={mockPassengerData} />

      {/* Important Notices */}
      <ImportantNotices />

      {/* Actions (Back button, Help button, Submit button) */}
      <CheckoutActions 
        onBackClick={handleBack} 
        onFinishPurchase={handleFinishPurchase} 
      />
    </div>
  );
}
