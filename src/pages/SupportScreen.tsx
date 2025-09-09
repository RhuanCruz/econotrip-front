import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { 
  Headphones, 
  Phone, 
  MessageCircle, 
  HelpCircle,
  Volume2, 
  ChevronLeft
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function SupportScreen() {
  const navigate = useNavigate();
  const [voiceMode, setVoiceMode] = useState(false);

  const handleCallSupport = () => {
    toast({
      title: "Ligação simulada",
      description: "Em um app real, isso abriria o discador do telefone.",
    });
  };

  const handleChatSupport = () => {
    window.open("https://wa.me/5511999999999", "_blank");
  };

  const toggleVoiceMode = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance('Você pode ativar o modo de leitura clicando no botão flutuante no canto inferior esquerdo e escutar um resumo da página');
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => setVoiceMode(true);
    utterance.onend = () => setVoiceMode(false);
    utterance.onerror = () => setVoiceMode(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleBackToHome = () => {
    navigate("/busca-voos");
  };

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const accordionAnimation = {
    hidden: { opacity: 0, height: 0 },
    show: { 
      opacity: 1, 
      height: "auto", 
      transition: { duration: 0.3 } 
    }
  };

  return (
    <motion.div 
      className="max-w-xl mx-auto pb-24"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center gap-3 mb-8"
        variants={itemAnimation}
      >
        <Headphones className="h-8 w-8 text-econotrip-blue" aria-hidden="true" aria-label="Ícone de fone de ouvido" />
        <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
          Central de Ajuda
        </h1>
      </motion.div>

      {/* Direct Support Section */}
      <motion.div className="mb-8" variants={itemAnimation}>
        <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-4">
          Atendimento Direto
        </h2>
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card className="p-6 rounded-2xl shadow-md bg-[#5FB4E8]/20 border-[#5FB4E8]">
              <div className="flex flex-col items-center text-center">
                <MessageCircle className="h-12 w-12 text-econotrip-blue mb-4" aria-hidden="true" aria-label="Ícone de mensagem" />
                <h3 className="text-xl font-bold text-econotrip-blue mb-2">Chat com suporte</h3>
                <p className="mb-4 text-lg">Converse com nossos atendentes online</p>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    icon={MessageCircle}
                    onClick={handleChatSupport}
                    className="w-full touch-target h-14"
                    aria-label="Iniciar chat com suporte"
                  >
                    Iniciar conversa
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Accessible Help Section */}
      <motion.div className="mb-12" variants={itemAnimation}>
        <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-4">
          Ajuda Acessível
        </h2>
        <motion.div 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card className="p-6 rounded-2xl shadow-md border-[#A8CF45] bg-[#A8CF45]/10">
            <div className="flex flex-col items-center text-center">
              <Volume2 className="h-12 w-12 text-[#A8CF45] mb-4" aria-hidden="true" aria-label="Ícone de volume" />
              <h3 className="text-xl font-bold text-econotrip-blue mb-2">Modo Leitura em Voz Alta</h3>
              <p className="mb-4 text-lg">Ative esta opção para que o conteúdo seja lido para você</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={voiceMode ? "secondary" : "primary"}
                        size="lg"
                        icon={Volume2}
                        onClick={toggleVoiceMode}
                        className={`w-full touch-target h-14 ${voiceMode ? "bg-green-600 text-white" : "bg-[#A8CF45] hover:bg-[#A8CF45]/90"}`}
                        aria-pressed={voiceMode}
                        aria-label={voiceMode ? "Desativar modo de leitura" : "Ativar modo de leitura"}
                      >
                        {voiceMode ? "Desativar Modo Leitura" : "Ativar Modo Leitura"}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ideal para usuários com baixa visão</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Back to Home Button - Fixed at Bottom */}
      <div className="fixed bottom-24 left-0 right-0 flex justify-center z-10 px-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full"
        >
          <Button
            variant="primary"
            size="lg"
            icon={ChevronLeft}
            iconPosition="left"
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-xl h-16 shadow-lg w-full touch-target"
            aria-label="Voltar para a página inicial"
          >
            Voltar para tela inicial
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
