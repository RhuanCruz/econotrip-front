
import React from "react";
import { MapPin, Plane } from "lucide-react";
import { AutocompleteInput } from "./AutocompleteInput";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";

interface OriginDestinationInputsProps {
  origem: string;
  destino: string;
  onInputChange: (field: string, value: string) => void;
}

export function OriginDestinationInputs({
  origem,
  destino,
  onInputChange
}: OriginDestinationInputsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-econotrip-blue mb-2">
          Para onde vamos viajar?
        </h2>
        <p className="text-gray-600 text-balance">
          Escolha seu ponto de partida e destino
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Origem */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-lg font-medium text-econotrip-blue flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              De onde você vai partir?
            </label>
            <ContextualTooltip content="Digite o nome da cidade ou aeroporto de onde você deseja partir. Exemplo: São Paulo, Rio de Janeiro, Brasília." />
          </div>
          <AutocompleteInput
            label=""
            placeholder="São Paulo, Rio de Janeiro..."
            value={origem}
            onChange={(value) => onInputChange("origem", value)}
            options={[]}
          />
        </div>

        {/* Destino */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-lg font-medium text-econotrip-blue flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Para onde você quer ir?
            </label>
            <ContextualTooltip content="Digite o nome da cidade ou país do seu destino dos sonhos. Exemplo: Lisboa, Paris, Nova York." />
          </div>
          <AutocompleteInput
            label=""
            placeholder="Lisboa, Paris, Nova York..."
            value={destino}
            onChange={(value) => onInputChange("destino", value)}
            options={[]}
          />
        </div>
      </div>
    </div>
  );
}
