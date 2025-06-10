
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { ObjetivoDeViagemSelector } from "@/components/roteiro/ObjetivoDeViagemSelector";
import { LinhaDoTempoRoteiro } from "@/components/roteiro/LinhaDoTempoRoteiro";
import { ChecklistRoteiro } from "@/components/roteiro/ChecklistRoteiro";
import { MapaDoDestino } from "@/components/roteiro/MapaDoDestino";
import { ProgressIndicator } from "@/components/roteiro/ProgressIndicator";
import { CollapsibleSection } from "@/components/roteiro/CollapsibleSection";
import { QuickActions } from "@/components/roteiro/QuickActions";
import { 
  ArrowLeft,
  Target,
  Calendar,
  CheckSquare,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export default function MeuRoteiroScreen() {
  const navigate = useNavigate();
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

  const handleVoltar = () => {
    if (etapaAtual === "planejamento") {
      setEtapaAtual("objetivo");
    } else {
      navigate(-1);
    }
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
      <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
        <ProgressIndicator currentStep="objetivo" />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={handleVoltar}
            className="flex-shrink-0"
            aria-label="Voltar"
          />
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-econotrip-orange" />
            <h1 className="text-xl font-semibold text-econotrip-blue">
              Planejador de Viagem
            </h1>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h2 className="text-lg font-semibold text-econotrip-blue mb-3">
            Qual é o seu objetivo para esta viagem?
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Escolha o tipo de experiência que você está buscando e criaremos um roteiro personalizado para você
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ObjetivoDeViagemSelector onSelect={handleObjetivoSelect} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
      <ProgressIndicator currentStep="planejamento" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={handleVoltar}
          className="flex-shrink-0"
          aria-label="Voltar ao objetivo"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-econotrip-orange" />
            <h1 className="text-xl font-semibold text-econotrip-blue">
              Meu Roteiro
            </h1>
          </div>
          <span className="text-xs bg-econotrip-orange/10 text-econotrip-orange px-2 py-1 rounded-full font-medium">
            {objetivoSelecionado}
          </span>
        </div>
      </motion.div>

      {/* Seções colapsíveis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <CollapsibleSection
          title="Cronograma da Viagem"
          icon={Calendar}
          defaultExpanded={true}
        >
          <LinhaDoTempoRoteiro objetivo={objetivoSelecionado} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Lista de Verificação"
          icon={CheckSquare}
          defaultExpanded={false}
        >
          <ChecklistRoteiro />
        </CollapsibleSection>

        <CollapsibleSection
          title="Mapa do Destino"
          icon={MapPin}
          defaultExpanded={false}
        >
          <MapaDoDestino />
        </CollapsibleSection>
      </motion.div>

      {/* Ações rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <QuickActions
          onNewEvent={handleNovoEvento}
          onExport={handleExportarRoteiro}
          onShare={handleCompartilharRoteiro}
          onEditObjective={() => setEtapaAtual("objetivo")}
        />
      </motion.div>
    </div>
  );
}
