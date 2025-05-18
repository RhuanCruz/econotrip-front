
import React from "react";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Button } from "@/components/ui-custom/Button";

export default function NotFound() {
  return (
    <LayoutBase>
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-4xl md:text-5xl font-bold text-econotrip-blue mb-4">
          Página não encontrada
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Button variant="primary" size="lg" asChild>
          <a href="/">Voltar ao início</a>
        </Button>
      </div>
    </LayoutBase>
  );
}
