
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft
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
    navigate(-1);
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
      <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-4">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={handleVoltar}
            className="flex-shrink-0"
            aria-label="Voltar"
          />
          <h1 className="text-xl font-semibold text-econotrip-blue">
            Meu Roteiro de Viagem
          </h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-econotrip-blue mb-2">
            Bem-vindo ao seu planejador pessoal!
          </h2>
          <p className="text-sm text-muted-foreground">
            Vamos planejar sua próxima viagem com calma e cuidado
          </p>
        </div>

        <ObjetivoDeViagemSelector onSelect={handleObjetivoSelect} />
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={handleVoltar}
          className="flex-shrink-0"
          aria-label="Voltar"
        />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-econotrip-blue">
            Meu Roteiro de Viagem
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Objetivo: {objetivoSelecionado}
          </p>
        </div>
      </div>

      {/* Seção de Linha do Tempo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-econotrip-blue" />
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
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-econotrip-blue" />
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
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-econotrip-blue" />
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
        className="grid grid-cols-1 gap-3 mt-6"
      >
        <Button
          variant="secondary"
          size="default"
          icon={Download}
          onClick={handleExportarRoteiro}
          className="w-full h-12"
          aria-label="Exportar roteiro em PDF"
        >
          Exportar PDF
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="default"
            icon={Share2}
            onClick={handleCompartilharRoteiro}
            className="w-full h-12"
            aria-label="Compartilhar roteiro"
          >
            Compartilhar
          </Button>

          <Button
            variant="primary"
            size="default"
            icon={Plus}
            onClick={handleNovoEvento}
            className="w-full h-12"
            aria-label="Adicionar novo evento"
          >
            Novo Evento
          </Button>
        </div>
      </motion.div>

      {/* Botão para voltar ao seletor de objetivo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-4 border-t border-gray-200"
      >
        <Button
          variant="secondary"
          size="default"
          onClick={() => setEtapaAtual("objetivo")}
          className="w-full h-12"
          aria-label="Alterar objetivo da viagem"
        >
          Alterar objetivo da viagem
        </Button>
      </motion.div>
    </div>
  );
}
