
import React from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";

export default function TelaBoasVindas() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl text-econotrip-blue mb-4">
              Bem-vindo ao{" "}
              <span className="text-econotrip-orange">ECONOTRIP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Viagens aéreas simples, acessíveis e sustentáveis para você
            </p>
            <div className="flex justify-center">
              <Button size="lg">
                <a href="/busca-voos">Começar</a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              title="Fácil de Usar"
              description="Interface pensada especialmente para você, com botões grandes e navegação simplificada."
            />
            <Card
              title="Economia"
              description="Encontre as melhores tarifas e promoções para seus destinos favoritos."
              variant="highlight"
            />
            <Card
              title="Sustentabilidade"
              description="Opções de voos com menor impacto ambiental para um turismo mais responsável."
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="font-museomoderno font-bold text-xl text-econotrip-blue mr-2">
                  ECONOTRIP
                </div>
                <span className="text-econotrip-orange font-medium">
                  PrimeVoyage
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                © {new Date().getFullYear()} ECONOTRIP. Todos os direitos
                reservados.
              </p>
            </div>
            <button
              onClick={() => document.body.classList.toggle("high-contrast")}
              className="px-4 py-2 bg-econotrip-blue text-white rounded-md touch-target flex items-center justify-center"
              aria-label="Alternar modo de alto contraste"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
              Modo de Alto Contraste
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
