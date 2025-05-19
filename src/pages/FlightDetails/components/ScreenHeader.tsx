
import React from "react";
import { ArrowLeft, Plane } from "lucide-react";

interface ScreenHeaderProps {
  onBack: () => void;
}

export function ScreenHeader({ onBack }: ScreenHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      <button 
        onClick={onBack}
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
  );
}
