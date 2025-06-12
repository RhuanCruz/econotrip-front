
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Search } from "lucide-react";
import { OriginDestinationInputs } from "./OriginDestinationInputs";
import { DateSelectionSection } from "./DateSelectionSection";
import { PassengerSelectionSection } from "./PassengerSelectionSection";
import { MilesSection } from "./MilesSection";
import { AdvancedFiltersSection } from "./AdvancedFiltersSection";

interface FormData {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: {
    adults: number;
    children: number;
    infants: number;
  };
  classe: string;
  usarMilhas: boolean;
  filtros: {
    melhorPreco: boolean;
    acessibilidade: boolean;
    sustentavel: boolean;
    voosDiretos: boolean;
  };
  orcamento: string;
  somenteDireto: boolean;
  voosSustentaveis: boolean;
  tarifasFlexiveis: boolean;
  acessibilidade: boolean;
}

interface FlightSearchFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  onPassengerChange: (type: keyof FormData["passageiros"], increment: boolean) => void;
  onSearch: () => void;
}

export function FlightSearchForm({
  formData,
  onInputChange,
  onPassengerChange,
  onSearch
}: FlightSearchFormProps) {
  return (
    <Card className="p-6 rounded-2xl shadow-lg">
      <div className="space-y-8">
        {/* Origem e Destino */}
        <OriginDestinationInputs
          origem={formData.origem}
          destino={formData.destino}
          onInputChange={onInputChange}
        />

        {/* Seleção de Datas */}
        <DateSelectionSection
          dataIda={formData.dataIda}
          dataVolta={formData.dataVolta}
          onInputChange={onInputChange}
        />

        {/* Seleção de Passageiros */}
        <PassengerSelectionSection
          passageiros={formData.passageiros}
          onPassengerChange={onPassengerChange}
        />

        {/* Milhas */}
        <MilesSection
          usarMilhas={formData.usarMilhas}
          onInputChange={onInputChange}
        />

        {/* Filtros Avançados */}
        <AdvancedFiltersSection
          filtros={formData.filtros}
          onInputChange={onInputChange}
        />

        {/* Botão de Busca */}
        <div className="text-center pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onSearch}
            icon={Search}
            iconPosition="right"
            className="w-full bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 text-white text-xl px-12 py-4 h-16 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Buscar passagens
          </Button>
          <p className="text-sm text-gray-600 mt-3 text-balance">
            Vamos encontrar as melhores opções para sua viagem!
          </p>
        </div>
      </div>
    </Card>
  );
}
