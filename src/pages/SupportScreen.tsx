
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { 
  Headphones, 
  Phone, 
  MessageCircle, 
  HelpCircle,
  ChevronDown, 
  ChevronUp, 
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
    toast({
      title: "Chat de suporte",
      description: "Em um app real, isso abriria o chat com suporte.",
    });
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    toast({
      title: voiceMode ? "Modo de leitura desativado" : "Modo de leitura ativado",
      description: voiceMode 
        ? "A leitura em voz alta foi desativada" 
        : "O conteúdo será lido em voz alta para você",
    });
  };

  const handleBackToHome = () => {
    navigate("/busca-voos");
  };

  return (
    <LayoutBase>
      <div className="max-w-4xl mx-auto py-6 pb-24 px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Headphones className="h-8 w-8 text-econotrip-blue" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
            Central de Ajuda
          </h1>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border rounded-xl mb-4 shadow-sm">
              <AccordionTrigger className="px-4 py-3 text-lg font-medium text-econotrip-blue hover:no-underline">
                Como alterar minha reserva?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-base">
                Para alterar sua reserva, acesse a seção "Meus Voos" no menu principal e 
                selecione a reserva que deseja modificar. Você pode alterar a data, horário 
                ou até mesmo o assento, dependendo das regras da tarifa escolhida.
                Lembre-se que algumas alterações podem ter custos adicionais.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl mb-4 shadow-sm">
              <AccordionTrigger className="px-4 py-3 text-lg font-medium text-econotrip-blue hover:no-underline">
                Como usar meus pontos de fidelidade?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-base">
                Os pontos do Programa Milhas Sênior podem ser usados na hora da compra de sua 
                passagem. Ao selecionar seu voo, na tela de pagamento você encontrará a opção 
                "Usar meus pontos". Você também pode acessar todas as vantagens disponíveis 
                na aba "Fidelidade" em seu perfil.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl mb-4 shadow-sm">
              <AccordionTrigger className="px-4 py-3 text-lg font-medium text-econotrip-blue hover:no-underline">
                Quais formas de pagamento são aceitas?
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-base">
                Aceitamos diversos meios de pagamento para sua comodidade: cartões de 
                crédito das principais bandeiras (parcelamento em até 12x), cartões de débito, 
                transferência bancária (Pix) e boleto bancário (para pagamentos à vista). 
                Os pontos do programa de fidelidade também podem ser utilizados como forma 
                de pagamento ou desconto.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Direct Support Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Atendimento Direto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 rounded-2xl shadow-md bg-[#5FB4E8]/20 border-[#5FB4E8]">
              <div className="flex flex-col items-center text-center">
                <Phone className="h-12 w-12 text-econotrip-blue mb-4" aria-hidden="true" />
                <h3 className="text-xl font-bold text-econotrip-blue mb-2">Fale com um atendente</h3>
                <p className="mb-4 text-lg">Atendimento por telefone das 8h às 20h</p>
                <Button
                  variant="primary"
                  size="lg"
                  icon={Phone}
                  onClick={handleCallSupport}
                  className="w-full md:w-auto"
                >
                  Ligar para 0800 123 456
                </Button>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl shadow-md bg-[#5FB4E8]/20 border-[#5FB4E8]">
              <div className="flex flex-col items-center text-center">
                <MessageCircle className="h-12 w-12 text-econotrip-blue mb-4" aria-hidden="true" />
                <h3 className="text-xl font-bold text-econotrip-blue mb-2">Chat com suporte</h3>
                <p className="mb-4 text-lg">Converse com nossos atendentes online</p>
                <Button
                  variant="primary"
                  size="lg"
                  icon={MessageCircle}
                  onClick={handleChatSupport}
                  className="w-full md:w-auto"
                >
                  Iniciar conversa
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Accessible Help Section */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Ajuda Acessível
          </h2>
          <Card className="p-6 rounded-2xl shadow-md border-[#A8CF45] bg-[#A8CF45]/10">
            <div className="flex flex-col items-center text-center">
              <Volume2 className="h-12 w-12 text-[#A8CF45] mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-econotrip-blue mb-2">Modo Leitura em Voz Alta</h3>
              <p className="mb-4 text-lg">Ative esta opção para que o conteúdo seja lido para você</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={voiceMode ? "secondary" : "primary"}
                      size="lg"
                      icon={Volume2}
                      onClick={toggleVoiceMode}
                      className={`w-full md:w-auto ${voiceMode ? "bg-green-600 text-white" : "bg-[#A8CF45] hover:bg-[#A8CF45]/90"}`}
                    >
                      {voiceMode ? "Desativar Modo Leitura" : "Ativar Modo Leitura"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ideal para usuários com baixa visão</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        </div>

        {/* Back to Home Button - Fixed at Bottom */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
          <Button
            variant="primary"
            size="lg"
            icon={ChevronLeft}
            iconPosition="left"
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-full h-16 shadow-lg px-10"
          >
            Voltar para tela inicial
          </Button>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Precisa de ajuda?"
                >
                  <HelpCircle className="h-7 w-7" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Precisa de ajuda?</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </LayoutBase>
  );
}
