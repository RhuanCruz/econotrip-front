
import React, { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ObjetivoDeViagemSelector } from "@/components/roteiro/ObjetivoDeViagemSelector";
import { LinhaDoTempoRoteiro } from "@/components/roteiro/LinhaDoTempoRoteiro";
import { ChecklistRoteiro } from "@/components/roteiro/ChecklistRoteiro";
import { MapaDoDestino } from "@/components/roteiro/MapaDoDestino";
import { motion } from "framer-motion";
import { Button } from "@/components/ui-custom/Button";
import { FileText, Share2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MeuRoteiroScreen() {
  const [objetivoViagem, setObjetivoViagem] = useState<string>("");
  const [nomeUsuario, setNomeUsuario] = useState("Viajante");
  
  useEffect(() => {
    // Recuperar dados do usuário do localStorage
    const perfilSalvo = localStorage.getItem("econotrip_perfil_viajante");
    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);
      setNomeUsuario(perfil.nome || "Viajante");
    }
    
    const objetivoSalvo = localStorage.getItem("econotrip_objetivo_viagem");
    if (objetivoSalvo) {
      setObjetivoViagem(objetivoSalvo);
    }
  }, []);

  const handleObjetivoSelect = (objetivo: string) => {
    setObjetivoViagem(objetivo);
    localStorage.setItem("econotrip_objetivo_viagem", objetivo);
    toast({
      title: "Objetivo definido!",
      description: "Vamos personalizar seu roteiro com base na sua escolha.",
    });
  };

  const handleExportarRoteiro = () => {
    toast({
      title: "Roteiro exportado!",
      description: "Seu roteiro foi salvo em PDF e está pronto para impressão.",
    });
  };

  const handleCompartilharRoteiro = () => {
    toast({
      title: "Roteiro compartilhado!",
      description: "Seu acompanhante de confiança receberá o link por e-mail.",
    });
  };

  const handleAdicionarEvento = () => {
    toast({
      title: "Novo evento",
      description: "Funcionalidade em desenvolvimento - em breve você poderá adicionar eventos personalizados.",
    });
  };

  if (!objetivoViagem) {
    return (
      <ScreenContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div>
            <h1 className="text-2xl font-semibold text-econotrip-blue mb-4">
              Olá, {nomeUsuario}!
            </h1>
            <p className="text-base text-gray-600 mb-8">
              Vamos planejar sua próxima viagem com calma?
            </p>
          </div>
          
          <ObjetivoDeViagemSelector onSelect={handleObjetivoSelect} />
        </motion.div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Meu Roteiro ECONOTRIP">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <p className="text-base text-gray-600">
            Estamos com você em cada etapa! ✈️
          </p>
        </div>

        <LinhaDoTempoRoteiro objetivo={objetivoViagem} />
        
        <ChecklistRoteiro />
        
        <MapaDoDestino />
        
        {/* Botões de ação organizados em grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Button
            variant="secondary"
            icon={FileText}
            onClick={handleExportarRoteiro}
            size="lg"
            className="w-full"
          >
            Exportar PDF
          </Button>
          <Button
            variant="secondary"
            icon={Share2}
            onClick={handleCompartilharRoteiro}
            size="lg"
            className="w-full"
          >
            Compartilhar
          </Button>
        </div>
      </motion.div>

      {/* Botão flutuante para adicionar evento */}
      <button
        onClick={handleAdicionarEvento}
        className="fixed bottom-24 right-6 w-14 h-14 bg-econotrip-orange text-white rounded-full shadow-lg hover:bg-econotrip-orange/90 transition-colors flex items-center justify-center z-40 touch-target"
        aria-label="Adicionar novo evento"
      >
        <Plus className="h-6 w-6" />
      </button>
    </ScreenContainer>
  );
}
