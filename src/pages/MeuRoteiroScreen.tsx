
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
      <ScreenContainer className="py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Olá, {nomeUsuario}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vamos planejar sua próxima viagem com calma?
          </p>
        </motion.div>
        
        <ObjetivoDeViagemSelector onSelect={handleObjetivoSelect} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue">
              Meu Roteiro ECONOTRIP
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Estamos com você em cada etapa! ✈️
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={FileText}
              onClick={handleExportarRoteiro}
              className="hidden md:flex"
            >
              Exportar PDF
            </Button>
            <Button
              variant="secondary"
              icon={Share2}
              onClick={handleCompartilharRoteiro}
              className="hidden md:flex"
            >
              Compartilhar
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <LinhaDoTempoRoteiro objetivo={objetivoViagem} />
        
        <ChecklistRoteiro />
        
        <MapaDoDestino />
        
        {/* Botões mobile */}
        <div className="flex flex-col gap-3 md:hidden">
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
            Compartilhar com acompanhante
          </Button>
        </div>
      </div>

      {/* Botão flutuante para adicionar evento */}
      <button
        onClick={handleAdicionarEvento}
        className="fixed bottom-24 right-6 w-14 h-14 bg-econotrip-orange text-white rounded-full shadow-lg hover:bg-econotrip-orange/90 transition-colors flex items-center justify-center z-40"
        aria-label="Adicionar novo evento"
      >
        <Plus className="h-6 w-6" />
      </button>
    </ScreenContainer>
  );
}
