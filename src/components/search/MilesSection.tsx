
import React from "react";
import { Gift } from "lucide-react";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";

interface MilesSectionProps {
  usarMilhas: boolean;
  onInputChange: (field: string, value: boolean) => void;
}

export function MilesSection({ usarMilhas, onInputChange }: MilesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="h-6 w-6 text-econotrip-orange" />
          <h2 className="text-xl font-semibold text-econotrip-blue">
            Usar milhas na viagem?
          </h2>
          <ContextualTooltip content="Se você possui milhas no programa EconoTrip ou de companhias aéreas, pode utilizá-las para reduzir o valor da passagem." />
        </div>
        <p className="text-gray-600 text-balance">
          Economize usando seus pontos de fidelidade
        </p>
      </div>

      <div className="flex justify-center">
        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-econotrip-orange transition-colors bg-white">
          <input
            type="checkbox"
            checked={usarMilhas}
            onChange={(e) => onInputChange("usarMilhas", e.target.checked)}
            className="w-6 h-6 text-econotrip-orange rounded focus:ring-2 focus:ring-econotrip-orange"
          />
          <span className="text-lg font-medium text-econotrip-blue">
            Sim, quero usar minhas milhas
          </span>
        </label>
      </div>
    </div>
  );
}
