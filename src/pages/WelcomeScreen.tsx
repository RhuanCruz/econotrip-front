
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Logo e Ícone */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <img
            src="/lovable-uploads/econotrip_logo.png"
            alt="EconoTrip"
            className="mb-4 rounded-2xl"
          />
        </div>

        {/* Title and subtitle */}
        <h1 className="text-3xl md:text-4xl font-bold text-econotrip-primary mb-4 font-museomoderno">
          Bem-vindo(a)
        </h1>
        <p className="text-xl text-gray-600 mb-10 font-manrope">
          Econotrip é Planejar e Viajar
        </p>
        <div className="mb-6" aria-hidden="true">
          <img
            src="/lovable-uploads/welcome_illustration.png"
            alt="Ilustração de boas-vindas"
            className="w-60 h-60 object-contain mx-auto drop-shadow-lg rounded-2xl"
          />
        </div>
        {/* Main button */}
        <div className="w-full mb-6">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full bg-econotrip-primary hover:bg-econotrip-primary/90 rounded-full h-14 shadow-lg hover:shadow-xl transition-all text-white font-semibold"
            onClick={() => navigate("/login")}
          >
            Começar
          </Button>
        </div>

        {/* Sign up link */}
        <button
          onClick={() => navigate("/registro")}
          className="text-econotrip-primary hover:text-econotrip-coral transition-colors text-lg underline underline-offset-2 touch-target font-medium"
        >
          Ainda não tem conta? Criar agora
        </button>

        {/* Help button */}
        <button
          className="fixed bottom-6 right-6 bg-econotrip-primary text-white rounded-full p-4 shadow-lg hover:bg-econotrip-primary/90 transition-colors touch-target"
          aria-label="Ajuda para começar"
          title="Ajuda para começar"
          onClick={() => alert("Assistente de ajuda será aberto aqui.")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}
