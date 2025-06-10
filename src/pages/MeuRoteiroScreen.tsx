
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
  ArrowLeft,
  Settings,
  Target
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
      <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
        {/* Header moderno */}
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
      {/* Header com informações do objetivo */}
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
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-econotrip-orange" />
            <h1 className="text-xl font-semibold text-econotrip-blue">
              Meu Roteiro
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-econotrip-orange/10 text-econotrip-orange px-2 py-1 rounded-full font-medium">
              {objetivoSelecionado}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={Settings}
              onClick={() => setEtapaAtual("objetivo")}
              className="text-xs h-6"
            >
              Alterar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Cronograma */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-econotrip-blue" />
          <h2 className="text-base font-medium text-econotrip-blue">
            Cronograma da Viagem
          </h2>
        </div>
        <LinhaDoTempoRoteiro objetivo={objetivoSelecionado} />
      </motion.div>

      {/* Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-econotrip-blue" />
          <h2 className="text-base font-medium text-econotrip-blue">
            Lista de Verificação
          </h2>
        </div>
        <ChecklistRoteiro />
      </motion.div>

      {/* Mapa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-econotrip-blue" />
          <h2 className="text-base font-medium text-econotrip-blue">
            Mapa do Destino
          </h2>
        </div>
        <MapaDoDestino />
      </motion.div>

      {/* Ações rápidas melhoradas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 pt-4 border-t border-gray-200"
      >
        <h3 className="text-base font-medium text-econotrip-blue mb-4">
          Ações do Roteiro
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="default"
            icon={Download}
            onClick={handleExportarRoteiro}
            className="h-12 flex-col text-sm"
            aria-label="Exportar roteiro em PDF"
          >
            <span>Exportar</span>
            <span className="text-xs opacity-75">PDF</span>
          </Button>

          <Button
            variant="secondary"
            size="default"
            icon={Share2}
            onClick={handleCompartilharRoteiro}
            className="h-12 flex-col text-sm"
            aria-label="Compartilhar roteiro"
          >
            <span>Compartilhar</span>
            <span className="text-xs opacity-75">Link</span>
          </Button>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={Plus}
          onClick={handleNovoEvento}
          className="w-full h-14 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90"
          aria-label="Adicionar novo evento"
        >
          Adicionar Novo Evento
        </Button>
      </motion.div>
    </div>
  );
}
