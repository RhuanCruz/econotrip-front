
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { CheckCircle, Mail, CreditCard, UserCircle, HelpCircle, Home, Plane, Calendar, Luggage } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function ConfirmationScreen() {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    // In a real app, this would navigate to the profile screen
    navigate("/perfil");
  };

  const handleBackToHome = () => {
    navigate("/busca-voos");
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto relative pb-24">
        {/* Header with Confirmation Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-econotrip-green/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-econotrip-green animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-museomoderno font-bold text-econotrip-blue">
            Reserva Confirmada!
          </h1>
          <p className="text-xl text-econotrip-blue mt-2">
            Preparamos tudo para a sua próxima viagem
          </p>
        </div>

        {/* Reservation Summary Card */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Resumo da Reserva
          </h2>
          
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <UserCircle className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Passageiro</p>
                <p className="text-gray-700">Maria Oliveira</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Plane className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Voo</p>
                <p className="text-gray-700">GRU → LIS</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Calendar className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Data e Horário</p>
                <p className="text-gray-700">10/03/2024 às 22h45</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <CreditCard className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Assento</p>
                <p className="text-gray-700">12A</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Luggage className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Bagagem</p>
                <p className="text-gray-700">1 mala + item pessoal</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Próximos Passos
          </h2>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-econotrip-green/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-econotrip-green" />
              </div>
              <p className="text-lg text-gray-700">
                Você receberá um e-mail com os detalhes da sua reserva.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-econotrip-green/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-econotrip-green" />
              </div>
              <p className="text-lg text-gray-700">
                Apresente seu documento no momento do embarque.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 h-6 w-6 rounded-full bg-econotrip-green/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-econotrip-green" />
              </div>
              <p className="text-lg text-gray-700">
                Acesse seu histórico em "Meu Perfil" a qualquer momento.
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col items-center space-y-4 mt-8">
          <Button
            variant="primary"
            size="lg"
            icon={UserCircle}
            onClick={handleViewProfile}
            className="w-full md:w-auto bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-xl h-16"
          >
            Ver meu perfil
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleBackToHome}
            icon={Home}
            iconPosition="left"
            className="text-lg"
          >
            Voltar para a tela inicial
          </Button>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6">
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
