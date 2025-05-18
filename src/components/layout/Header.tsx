
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && <SidebarTrigger className="mr-4 touch-target" />}
        <div className="flex items-center">
          <div className="font-museomoderno font-bold text-2xl text-econotrip-blue mr-2">
            ECONOTRIP
          </div>
          <span className="text-econotrip-orange font-medium">PrimeVoyage</span>
        </div>
      </div>
      {userName ? (
        <div className="text-lg font-medium text-econotrip-blue">
          Olá, {userName}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <a 
            href="/login" 
            className="text-econotrip-blue hover:text-econotrip-blue/80 font-medium text-lg"
          >
            Entrar
          </a>
          <a 
            href="/cadastro"
            className="bg-econotrip-orange hover:bg-econotrip-orange/90 text-white font-medium py-2 px-6 rounded-md text-lg"
          >
            Cadastrar
          </a>
        </div>
      )}
    </header>
  );
}
