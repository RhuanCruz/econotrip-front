
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Search, HelpCircle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourIntroProps {
  onComplete: () => void;
}

export function TourIntro({ onComplete }: TourIntroProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("econotrip_seen_tour");
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const tourSteps = [
    {
      icon: CheckCircle,
      title: "Crie radares customizados",
      description: "Você poderá definir um ponto de saída e um ponto de chegada e nosso robô fará uma buasca periódica com as melhores ofertas.",
      tip: "Coloque valores reais para que seja possível achar ofertas."
    },
    {
      icon: CheckCircle,
      title: "Planeje sua viagem",
      description: "Use o simulador de viagem para planejar e simular sua próxima viagem, com valores aproximados e lugares para visitar.",
      tip: "Você pode escolher mais de um destino."
    },
    {
      icon: Search,
      title: "Como buscar uma passagem",
      description: "Use nossa busca intuitiva para encontrar voos. Digite origem, destino e datas - é simples assim!",
      tip: "Você pode salvar suas buscas para uso posterior."
    },
    {
      icon: HelpCircle,
      title: "Como acessar ajuda",
      description: "Precisa de ajuda? Clique no botão de ajuda flutuante ou acesse o menu de suporte para falar conosco.",
      tip: "Estamos sempre prontos para ajudar você!"
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("econotrip_seen_tour", "true");
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const IconComponent = currentTourStep.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 rounded-2xl shadow-2xl bg-white">
            <div className="flex justify-between items-start mb-6">
              <h2 id="tour-title" className="text-xl font-museomoderno font-bold text-econotrip-blue">
                Bem-vindo ao ECONOTRIP!
              </h2>
              <button
                onClick={handleSkip}
                className="p-2 rounded-full hover:bg-gray-100 touch-target"
                aria-label="Pular apresentação"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-econotrip-blue/10 flex items-center justify-center mx-auto mb-4">
                <IconComponent className="h-10 w-10 text-econotrip-blue" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-bold text-econotrip-blue mb-3">
                {currentTourStep.title}
              </h3>

              <p className="text-base text-gray-700 mb-4 leading-relaxed">
                {currentTourStep.description}
              </p>

              <div className="bg-econotrip-green/10 p-3 rounded-xl">
                <p className="text-sm font-medium text-econotrip-blue">
                  💡 {currentTourStep.tip}
                </p>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center mb-6">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 transition-colors ${index === currentStep ? "bg-econotrip-blue" : "bg-gray-300"
                    }`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleSkip}
                className="flex-1"
                aria-label="Pular apresentação"
              >
                Pular
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex-1"
                aria-label={currentStep === tourSteps.length - 1 ? "Finalizar apresentação" : "Próximo passo"}
              >
                {currentStep === tourSteps.length - 1 ? "Entendi!" : "Próximo"}
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
