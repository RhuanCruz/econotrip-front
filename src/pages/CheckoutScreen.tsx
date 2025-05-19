
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { 
  ArrowLeft, 
  CheckCircle, 
  Plane, 
  Clock, 
  User, 
  Calendar, 
  Mail,
  HelpCircle,
  CreditCard,
  Info
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Mock passenger data
const mockPassengerData = {
  name: "Maria Oliveira",
  cpf: "123.456.789-00",
  birthdate: "12/05/1958",
  email: "maria@exemplo.com"
};

// Mock flight data
const mockFlightData = {
  id: "flight-1",
  origin: "São Paulo",
  originCode: "GRU",
  destination: "Lisboa",
  destinationCode: "LIS",
  date: "10/03/2024",
  time: "22h45",
  duration: "10h 25min",
  stops: "Voo direto",
  price: 2350.0,
};

export default function CheckoutScreen() {
  const navigate = useNavigate();

  const handleFinishPurchase = () => {
    // Navigate to the confirmation screen
    navigate("/confirmacao");
  };

  const handleBack = () => {
    navigate("/detalhes-voo");
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto relative pb-24">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="mr-3 touch-target p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Voltar para detalhes do voo"
          >
            <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
          </button>
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-econotrip-orange mr-3" />
            <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
              Finalizar Compra
            </h1>
          </div>
        </div>

        {/* Flight Summary Card */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Resumo do Voo
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-xl mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
                    <span className="font-bold text-xs">BR</span>
                  </div>
                  <span className="text-xs font-medium">{mockFlightData.originCode}</span>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-gray-300 relative h-6">
                  <Plane className="h-5 w-5 text-econotrip-blue absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
                    <span className="font-bold text-xs">PT</span>
                  </div>
                  <span className="text-xs font-medium">{mockFlightData.destinationCode}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-between px-2">
                <div className="text-center">
                  <h3 className="font-medium text-econotrip-blue">{mockFlightData.origin}</h3>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-econotrip-blue">{mockFlightData.destination}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Calendar className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Data</p>
                <p className="text-gray-700">{mockFlightData.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Clock className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Horário e Duração</p>
                <p className="text-gray-700">{mockFlightData.time} • {mockFlightData.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Plane className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Tipo de Voo</p>
                <p className="text-gray-700">{mockFlightData.stops}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Valor total</p>
              <p className="text-3xl md:text-4xl font-bold text-econotrip-orange">
                R$ {mockFlightData.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Passenger Information Card */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Dados do Passageiro
          </h2>
          
          <div className="space-y-4 text-lg">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <User className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Nome Completo</p>
                <p className="text-gray-700">{mockPassengerData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Info className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">CPF</p>
                <p className="text-gray-700">{mockPassengerData.cpf}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Calendar className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">Data de Nascimento</p>
                <p className="text-gray-700">{mockPassengerData.birthdate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Mail className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-econotrip-blue">E-mail</p>
                <p className="text-gray-700">{mockPassengerData.email}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notices */}
        <div className="space-y-4 mb-8">
          <AlertBox 
            type="info" 
            icon={Info}
            title="Política de cancelamento"
          >
            O cancelamento é gratuito até 48h antes da partida.
          </AlertBox>
          
          <AlertBox 
            type="success" 
            icon={CheckCircle}
            title="Programa de fidelidade"
          >
            Você acumulou 30 pontos no programa Milhas Sênior!
          </AlertBox>
        </div>

        {/* "Voltar para detalhes do voo" button */}
        <div className="flex justify-center mt-8 mb-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            icon={ArrowLeft}
            iconPosition="left"
            className="text-lg"
          >
            Voltar para detalhes do voo
          </Button>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-24 right-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Ajuda rápida"
                >
                  <HelpCircle className="h-7 w-7" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Ajuda rápida</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Fixed Bottom CTA Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="primary"
              size="lg"
              icon={CheckCircle}
              onClick={handleFinishPurchase}
              className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-xl h-16"
            >
              Finalizar Compra
            </Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
}
