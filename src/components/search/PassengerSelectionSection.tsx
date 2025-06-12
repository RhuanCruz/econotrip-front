
import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";

interface PassengerSelectionSectionProps {
  passageiros: {
    adults: number;
    children: number;
    infants: number;
  };
  onPassengerChange: (type: keyof typeof passageiros, increment: boolean) => void;
}

export function PassengerSelectionSection({
  passageiros,
  onPassengerChange
}: PassengerSelectionSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="h-6 w-6 text-econotrip-blue" />
          <h2 className="text-xl font-semibold text-econotrip-blue">
            Quantas pessoas vão viajar?
          </h2>
          <ContextualTooltip content="Defina quantos adultos, crianças e bebês farão a viagem. Isso nos ajuda a encontrar as melhores tarifas para seu grupo." />
        </div>
        <p className="text-gray-600 text-balance">
          Selecione o número de passageiros
        </p>
      </div>
      
      <Card className="p-6 bg-gray-50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-medium text-econotrip-blue">Adultos</span>
              <p className="text-sm text-gray-600">12 anos ou mais</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPassengerChange("adults", false)}
                disabled={passageiros.adults <= 1}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
                aria-label="Diminuir número de adultos"
              >
                −
              </Button>
              <span className="w-8 text-center font-semibold text-xl text-econotrip-blue">
                {passageiros.adults}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPassengerChange("adults", true)}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
                aria-label="Aumentar número de adultos"
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-medium text-econotrip-blue">Crianças</span>
              <p className="text-sm text-gray-600">2-11 anos</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPassengerChange("children", false)}
                disabled={passageiros.children <= 0}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
                aria-label="Diminuir número de crianças"
              >
                −
              </Button>
              <span className="w-8 text-center font-semibold text-xl text-econotrip-blue">
                {passageiros.children}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPassengerChange("children", true)}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
                aria-label="Aumentar número de crianças"
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-medium text-econotrip-blue">Bebês</span>
              <p className="text-sm text-gray-600">Até 2 anos</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPassengerChange("infants", false)}
                disabled={passageiros.infants <= 0}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
                aria-label="Diminuir número de bebês"
              >
                −
              </Button>
              <span className="w-8 text-center font-semibold text-xl text-econotrip-blue">
                {passageiros.infants}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPassengerChange("infants", true)}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
                aria-label="Aumentar número de bebês"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
