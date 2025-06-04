
import React, { useState } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { ObjetivoDeViagemSelector } from "@/components/roteiro/ObjetivoDeViagemSelector";
import { LinhaDoTempoRoteiro } from "@/components/roteiro/LinhaDoTempoRoteiro";
import { ChecklistRoteiro } from "@/components/roteiro/ChecklistRoteiro";
import { MapaDoDestino } from "@/components/roteiro/MapaDoDestino";
import { 
  Plus, 
  Download, 
  Share2,
  MapPin,
  Calendar,
  CheckSquare,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export default function MeuRoteiroScreen() {
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<string>("descanso");
  const [etapaAtual, setEtapaAtual] = useState<"objetivo" | "planejamento">("objetivo");

  const handleObjetivoSelect = (objetivo: string) => {
    setObjetivoSelecionado(objetivo);
    setEtapaAtual("planejamento");
    toast({
      title: "Objetivo selecionado!",
      description: "Agora vamos criar seu roteiro personalizado.",
    });
  };

  const handleExportarRoteiro = () => {
    toast({
      title: "Roteiro exportado!",
      description: "Seu roteiro foi salvo em PDF com sucesso.",
    });
  };

  const handleCompartilharRoteiro = () => {
    toast({
      title: "Roteiro compartilhado!",
      description: "Link de compartilhamento enviado para seu acompanhante.",
    });
  };

  const handleNovoEvento = () => {
    toast({
      title: "Novo evento",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  if (etapaAtual === "objetivo") {
    return (
      <div className="max-w-screen-sm mx-auto px-6 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-econotrip-blue mb-4">
            Meu Roteiro de Viagem
          </h1>
          <h2 className="text-xl font-semibold text-econotrip-blue mb-2">
            Bem-vindo ao seu planejador pessoal!
          </h2>
          <p className="text-base text-muted-foreground">
            Vamos planejar sua próxima viagem com calma e cuidado
          </p>
        </div>

        <ObjetivoDeViagemSelector onSelect={handleObjetivoSelect} />
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-6 py-6 space-y-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-econotrip-blue mb-4">
          Meu Roteiro de Viagem
        </h1>
        <p className="text-base font-medium text-muted-foreground mb-2">
          Objetivo: {objetivoSelecionado}
        </p>
      </div>

      {/* Seção de Linha do Tempo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-6 w-6 text-econotrip-blue" />
          <h2 className="text-base font-medium text-econotrip-blue">
            Cronograma da Viagem
          </h2>
        </div>
        <LinhaDoTempoRoteiro objetivo={objetivoSelecionado} />
      </motion.div>

      {/* Seção de Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="h-6 w-6 text-econotrip-blue" />
          <h2 className="text-base font-medium text-econotrip-blue">
            Lista de Verificação
          </h2>
        </div>
        <ChecklistRoteiro />
      </motion.div>

      {/* Seção do Mapa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-6 w-6 text-econotrip-blue" />
          <h2 className="text-base font-medium text-econotrip-blue">
            Mapa do Destino
          </h2>
        </div>
        <MapaDoDestino />
      </motion.div>

      {/* Botões de Ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
      >
        <Button
          variant="secondary"
          size="lg"
          icon={Download}
          onClick={handleExportarRoteiro}
          className="w-full"
          aria-label="Exportar roteiro em PDF"
        >
          Exportar PDF
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={Share2}
          onClick={handleCompartilharRoteiro}
          className="w-full"
          aria-label="Compartilhar roteiro com acompanhante"
        >
          Compartilhar
        </Button>

        <Button
          variant="primary"
          size="lg"
          icon={Plus}
          onClick={handleNovoEvento}
          className="w-full"
          aria-label="Adicionar novo evento ao roteiro"
        >
          Novo Evento
        </Button>
      </motion.div>

      {/* Botão para voltar ao seletor de objetivo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-6 border-t border-gray-200"
      >
        <Button
          variant="secondary"
          size="default"
          onClick={() => setEtapaAtual("objetivo")}
          className="w-full"
          aria-label="Alterar objetivo da viagem"
        >
          Alterar objetivo da viagem
        </Button>
      </motion.div>
    </div>
  );
}
