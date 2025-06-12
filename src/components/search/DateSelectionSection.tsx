
import React from "react";
import { DateSelector } from "./DateSelector";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";

interface DateSelectionSectionProps {
  dataIda: string;
  dataVolta: string;
  onInputChange: (field: string, value: string) => void;
}

export function DateSelectionSection({
  dataIda,
  dataVolta,
  onInputChange
}: DateSelectionSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center px-2">
        <h2 className="text-lg font-semibold text-econotrip-blue mb-2">
          Quando você quer viajar?
        </h2>
        <p className="text-sm text-gray-600 text-balance">
          Escolha as datas da sua viagem
        </p>
      </div>

      <div className="space-y-4">
        {/* Data de Ida */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <h3 className="text-base font-medium text-econotrip-blue">
              Data de partida
            </h3>
            <ContextualTooltip content="Escolha a data que você gostaria de partir. Você pode selecionar datas futuras ou usar as opções rápidas." />
          </div>
          <DateSelector
            label="Quando você quer partir?"
            value={dataIda}
            onChange={(value) => onInputChange("dataIda", value)}
          />
        </div>

        {/* Data de Volta */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <h3 className="text-base font-medium text-econotrip-blue">
              Data de retorno (opcional)
            </h3>
            <ContextualTooltip content="Se você já sabe quando quer voltar, selecione a data. Caso contrário, pode deixar em branco para ver apenas passagens de ida." />
          </div>
          <DateSelector
            label="Quando você quer voltar?"
            value={dataVolta}
            onChange={(value) => onInputChange("dataVolta", value)}
            minDate={dataIda}
          />
        </div>
      </div>
    </div>
  );
}
