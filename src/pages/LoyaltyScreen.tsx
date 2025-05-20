
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Star, Award, ArrowLeft, Plane, Leaf, Megaphone, HelpCircle, ChevronLeft, Medal } from "lucide-react";

export default function LoyaltyScreen() {
  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate("/perfil");
  };

  const currentPoints = 180;
  const targetPoints = 300;
  const remainingPoints = targetPoints - currentPoints;
  const progressPercentage = (currentPoints / targetPoints) * 100;

  return (
    <LayoutBase userName="Maria">
      <div className="max-w-4xl mx-auto py-6 pb-24 px-4 relative">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <Star className="h-8 w-8 text-yellow-500" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
            Programa Milhas Sênior
          </h1>
        </div>

        {/* Current Points Section */}
        <Card className="mb-8 p-6 rounded-2xl shadow-md text-center">
          <div className="flex justify-center items-center mb-4">
            <Medal className="h-8 w-8 text-econotrip-green mr-2" aria-hidden="true" />
            <p className="text-2xl md:text-3xl font-bold text-econotrip-green">
              Você possui {currentPoints} pontos
            </p>
          </div>

          <div className="mb-6">
            <Progress 
              value={progressPercentage} 
              className="h-4 rounded-full bg-gray-200"
              aria-label={`Progresso: ${progressPercentage.toFixed(0)}% do caminho para o próximo nível`}
            />
            <p className="text-lg text-econotrip-blue mt-3">
              Faltam <span className="font-bold">{remainingPoints} pontos</span> para o próximo nível!
            </p>
          </div>
        </Card>

        {/* Unlocked Rewards Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Recompensas Desbloqueadas
          </h2>
          
          <div className="space-y-4">
            <Card className="p-4 rounded-2xl shadow-md border-econotrip-green bg-econotrip-green/10">
              <div className="flex items-center gap-3">
                <Award className="h-10 w-10 text-econotrip-green flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-econotrip-blue">Desconto de 10% na próxima viagem</h3>
                  <p className="text-gray-600">Desbloqueado ao atingir 100 pontos</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl shadow-md border-econotrip-green bg-econotrip-green/10">
              <div className="flex items-center gap-3">
                <Award className="h-10 w-10 text-econotrip-green flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-econotrip-blue">Prioridade no embarque</h3>
                  <p className="text-gray-600">Desbloqueado ao atingir 150 pontos</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* How to Earn Points Section */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Como acumular mais pontos
          </h2>
          
          <div className="space-y-4">
            <Card className="p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-3">
                <Plane className="h-8 w-8 text-econotrip-blue flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-econotrip-blue">Viaje em dias úteis</h3>
                  <p className="text-gray-600">+30 pontos</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-3">
                <Leaf className="h-8 w-8 text-econotrip-green flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-econotrip-blue">Escolha destinos sustentáveis</h3>
                  <p className="text-gray-600">+40 pontos</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-econotrip-orange flex-shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-econotrip-blue">Compartilhe sua experiência</h3>
                  <p className="text-gray-600">+50 pontos</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Info Alert */}
        <AlertBox 
          type="info" 
          icon={Megaphone}
          className="mb-12"
          title="Próxima meta: 300 pontos"
        >
          <p>Ao atingir 300 pontos você ganhará uma mala de mão grátis em todos os voos!</p>
        </AlertBox>

        {/* Back to Profile Button - Fixed at Bottom */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
          <Button
            variant="primary"
            size="lg"
            icon={ChevronLeft}
            iconPosition="left"
            onClick={handleBackToProfile}
            className="bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-full h-16 shadow-lg px-10"
          >
            Voltar para Meu Perfil
          </Button>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Ajuda sobre o programa"
                >
                  <HelpCircle className="h-7 w-7" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Ajuda sobre o programa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </LayoutBase>
  );
}
