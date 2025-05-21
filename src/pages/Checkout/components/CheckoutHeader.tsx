
import React from "react";
import { ArrowLeft, CreditCard } from "lucide-react";

interface CheckoutHeaderProps {
  onBackClick: () => void;
}

export function CheckoutHeader({ onBackClick }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center mb-8">
      <button 
        onClick={onBackClick}
        className="mr-3 touch-target p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Voltar para detalhes do voo"
      >
        <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
      </button>
      <div className="flex items-center">
        <CreditCard className="h-8 w-8 text-econotrip-orange mr-3" />
        <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
          Finalizar Compra
        </h1>
      </div>
    </div>
  );
}
