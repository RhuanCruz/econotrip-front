
import React, { useState } from "react";
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";
import { motion, AnimatePresence } from "framer-motion";

interface AdvancedFiltersSectionProps {
  filtros: {
    melhorPreco: boolean;
    acessibilidade: boolean;
    sustentavel: boolean;
    voosDiretos: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

export function AdvancedFiltersSection({
  filtros,
  onInputChange
}: AdvancedFiltersSectionProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="space-y-3">
      <div className="text-center">
        <Button
          variant="secondary"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="h-12 px-4 text-base rounded-xl w-full"
          aria-label={showAdvancedFilters ? "Ocultar filtros avançados" : "Mostrar filtros avançados"}
        >
          <Settings className="h-4 w-4 mr-2" />
          {showAdvancedFilters ? "Ocultar" : "Mostrar"} opções avançadas
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-gray-50 space-y-4">
              <div className="text-center mb-3">
                <h3 className="text-base font-semibold text-econotrip-blue">
                  Filtros personalizados
                </h3>
                <p className="text-sm text-gray-600 text-balance">
                  Refine sua busca com opções específicas
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-econotrip-orange transition-colors bg-white">
                  <input
                    type="checkbox"
                    checked={filtros.melhorPreco}
                    onChange={(e) => onInputChange("filtros", {
                      ...filtros,
                      melhorPreco: e.target.checked
                    })}
                    className="w-4 h-4 text-econotrip-orange rounded"
                  />
                  <span className="text-sm font-medium flex-1">Mostrar apenas menores preços</span>
                  <ContextualTooltip content="Exibe primeiro as opções mais econômicas para sua viagem." />
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-econotrip-orange transition-colors bg-white">
                  <input
                    type="checkbox"
                    checked={filtros.acessibilidade}
                    onChange={(e) => onInputChange("filtros", {
                      ...filtros,
                      acessibilidade: e.target.checked
                    })}
                    className="w-4 h-4 text-econotrip-orange rounded"
                  />
                  <span className="text-sm font-medium flex-1">Voos com acessibilidade</span>
                  <ContextualTooltip content="Prioriza voos e companhias que oferecem facilidades para pessoas com mobilidade reduzida ou necessidades especiais." />
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-econotrip-orange transition-colors bg-white">
                  <input
                    type="checkbox"
                    checked={filtros.sustentavel}
                    onChange={(e) => onInputChange("filtros", {
                      ...filtros,
                      sustentavel: e.target.checked
                    })}
                    className="w-4 h-4 text-econotrip-orange rounded"
                  />
                  <span className="text-sm font-medium flex-1">Voos sustentáveis</span>
                  <ContextualTooltip content="Mostra voos com menor impacto ambiental, usando aeronaves mais eficientes." />
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-econotrip-orange transition-colors bg-white">
                  <input
                    type="checkbox"
                    checked={filtros.voosDiretos}
                    onChange={(e) => onInputChange("filtros", {
                      ...filtros,
                      voosDiretos: e.target.checked
                    })}
                    className="w-4 h-4 text-econotrip-orange rounded"
                  />
                  <span className="text-sm font-medium flex-1">Apenas voos diretos</span>
                  <ContextualTooltip content="Exibe somente voos sem conexões, mais rápidos e confortáveis." />
                </label>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
