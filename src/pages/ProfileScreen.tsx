
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Edit2, Medal, Clock, Calendar, Home, Plane, MapPin, HelpCircle, CheckCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DetailItem } from "@/pages/FlightDetails/components/DetailItem";

export default function ProfileScreen() {
  const navigate = useNavigate();

  const handleViewLoyalty = () => {
    // In a real app, this would navigate to the loyalty screen
    navigate("/fidelidade");
  };

  const handleEditProfile = () => {
    // Navigate to the edit profile screen
    navigate("/editar-perfil");
  };

  const handleBackToHome = () => {
    navigate("/busca-voos");
  };

  return (
    <LayoutBase userName="Maria">
      <div className="max-w-5xl mx-auto py-6 pb-24 relative">
        {/* Header Section with Avatar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-econotrip-orange/20">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Maria Oliveira" />
              <AvatarFallback className="bg-econotrip-orange/20">
                <UserCircle className="h-10 w-10 text-econotrip-orange" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue">
              Meu Perfil
            </h1>
          </div>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleEditProfile} 
            icon={Edit2}
            className="touch-target"
            aria-label="Editar perfil"
          >
            Editar
          </Button>
        </div>

        {/* Personal Information Section */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Dados Pessoais
          </h2>
          
          <div className="space-y-4 text-lg">
            <DetailItem 
              icon={UserCircle} 
              title="Nome Completo" 
              value="Maria Oliveira" 
            />
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-econotrip-blue" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 5L2 11l19 5.5L21 5zm-9 14v-7.5" />
              </svg>
              <div>
                <p className="font-medium text-econotrip-blue">E-mail</p>
                <p className="text-gray-700">maria@exemplo.com</p>
              </div>
            </div>
            
            <DetailItem 
              icon={Calendar} 
              title="Data de Nascimento" 
              value="12/05/1958" 
            />
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-econotrip-blue" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <p className="font-medium text-econotrip-blue">CPF</p>
                <p className="text-gray-700">123.456.789-00</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Loyalty Program Section */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md border-econotrip-green bg-econotrip-green/5">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue">
              Programa Milhas Sênior
            </h2>
            <Medal className="h-8 w-8 text-econotrip-green" />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xl font-bold text-econotrip-green">180</p>
              <p className="text-lg text-econotrip-blue">pontos acumulados</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-econotrip-green h-2.5 rounded-full" style={{ width: '36%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">500 pontos para o próximo nível</p>
          </div>
          
          <Button 
            variant="secondary" 
            onClick={handleViewLoyalty} 
            icon={Medal}
            className="w-full justify-center"
          >
            Ver detalhes do programa
          </Button>
        </Card>

        {/* Travel History Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue">
              Minhas Viagens
            </h2>
            <Plane className="h-6 w-6 text-econotrip-blue" />
          </div>
          
          <div className="space-y-4">
            {/* First Trip Card */}
            <Card className="p-5 rounded-2xl shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-econotrip-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Lisboa, Portugal</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-base">10/03/2024</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-econotrip-green/10 text-econotrip-green px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Concluído</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" size="sm">
                  Ver detalhes
                </Button>
              </div>
            </Card>
            
            {/* Second Trip Card */}
            <Card className="p-5 rounded-2xl shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-5 w-5 text-econotrip-orange" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Foz do Iguaçu, Brasil</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-base">18/11/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-econotrip-green/10 text-econotrip-green px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Concluído</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" size="sm">
                  Ver detalhes
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            icon={Home}
            iconPosition="left"
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-full h-16 shadow-lg px-10"
          >
            Voltar para tela inicial
          </Button>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Precisa de ajuda com seu perfil?"
                >
                  <HelpCircle className="h-7 w-7" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Precisa de ajuda com seu perfil?</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </LayoutBase>
  );
}
