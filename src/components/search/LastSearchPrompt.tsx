
import React from "react";
import { Clock, MapPin, Users, X } from "lucide-react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";

interface SearchData {
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
}

interface LastSearchPromptProps {
  lastSearch: SearchData;
  onRestore: () => void;
  onDismiss: () => void;
}

export function LastSearchPrompt({ lastSearch, onRestore, onDismiss }: LastSearchPromptProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  const getPassengerText = () => {
    const total = lastSearch.passageiros.adults + lastSearch.passageiros.children + lastSearch.passageiros.infants;
    if (total === 1) return "1 passageiro";
    return `${total} passageiros`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="p-4 bg-gradient-to-r from-econotrip-blue/5 to-econotrip-orange/5 border-econotrip-orange/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-econotrip-orange/10 rounded-lg">
            <Clock className="h-5 w-5 text-econotrip-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-econotrip-blue mb-2">
              Continuar última busca?
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{lastSearch.origem} → {lastSearch.destino}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDate(lastSearch.dataIda)}
                  {lastSearch.dataVolta && ` - ${formatDate(lastSearch.dataVolta)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{getPassengerText()}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={onRestore}
                className="text-sm"
              >
                Continuar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onDismiss}
                className="text-sm"
              >
                Nova busca
              </Button>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
