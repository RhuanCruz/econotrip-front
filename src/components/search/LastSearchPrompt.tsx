
import React from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Clock, X } from "lucide-react";
import { motion } from "framer-motion";

interface LastSearchPromptProps {
  lastSearch: {
    origem: string;
    destino: string;
    dataIda: string;
    dataVolta: string;
    passageiros: string;
  };
  onRestore: () => void;
  onDismiss: () => void;
}

export function LastSearchPrompt({ lastSearch, onRestore, onDismiss }: LastSearchPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="p-4 rounded-xl border-econotrip-blue/30 bg-econotrip-blue/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-econotrip-blue/10 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-econotrip-blue" aria-hidden="true" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-econotrip-blue mb-2">
              Deseja continuar de onde parou?
            </h3>
            
            <div className="text-sm text-gray-700 mb-4">
              <p className="mb-1">
                <strong>Última busca:</strong> {lastSearch.origem} → {lastSearch.destino}
              </p>
              <p className="mb-1">
                <strong>Data:</strong> {new Date(lastSearch.dataIda).toLocaleDateString("pt-BR")}
                {lastSearch.dataVolta && ` até ${new Date(lastSearch.dataVolta).toLocaleDateString("pt-BR")}`}
              </p>
              <p>
                <strong>Passageiros:</strong> {lastSearch.passageiros}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onRestore}
                className="flex-1"
                aria-label="Continuar busca anterior"
              >
                Continuar busca anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onDismiss}
                className="flex-1"
                aria-label="Iniciar nova busca"
              >
                Nova busca
              </Button>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className="p-2 rounded-full hover:bg-gray-100 touch-target flex-shrink-0"
            aria-label="Fechar sugestão"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
