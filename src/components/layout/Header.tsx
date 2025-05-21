
import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center" aria-label="Ir para página inicial">
          <div className="font-museomoderno font-bold text-2xl text-econotrip-blue mr-2">
            ECONOTRIP
          </div>
          <span className="text-econotrip-orange font-medium">PrimeVoyage</span>
        </Link>
      </div>
      {userName ? (
        <div className="text-lg font-medium text-econotrip-blue">
          Olá, {userName}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-econotrip-blue hover:text-econotrip-blue/80 font-medium text-lg touch-target py-2 px-4"
            aria-label="Entrar na sua conta"
          >
            Entrar
          </Link>
          <Link 
            to="/registro"
            className="bg-econotrip-orange hover:bg-econotrip-orange/90 text-white font-medium py-3 px-6 rounded-full text-lg touch-target"
            aria-label="Criar nova conta"
          >
            Cadastrar
          </Link>
        </div>
      )}
    </header>
  );
}
