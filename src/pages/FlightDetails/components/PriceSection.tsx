
import React from "react";
import { Button } from "@/components/ui-custom/Button";
import { ArrowLeft } from "lucide-react";

interface PriceSectionProps {
  price: number;
  onBack: () => void;
}

export function PriceSection({ price, onBack }: PriceSectionProps) {
  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <div className="text-center mb-6">
        <p className="text-gray-600 text-lg mb-2">Preço por pessoa</p>
        <p className="text-4xl md:text-5xl font-bold text-econotrip-orange">
          R$ {price.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="secondary"
          onClick={onBack}
          icon={ArrowLeft}
          iconPosition="left"
          className="text-lg"
        >
          Voltar para resultados
        </Button>
      </div>
    </div>
  );
}
