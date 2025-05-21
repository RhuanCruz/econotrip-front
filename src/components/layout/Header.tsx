
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if we should show back button based on the route
  const showBackButton = !["/", "/busca-voos", "/perfil"].includes(location.pathname);
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 px-4 md:px-6 flex items-center justify-between w-full overflow-hidden">
      <div className="max-w-screen-sm mx-auto w-full flex items-center justify-between gap-x-4">
        <div className="flex items-center">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="mr-2 p-2 rounded-full hover:bg-gray-100 touch-target"
              aria-label="Voltar para a tela anterior"
            >
              <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
            </button>
          ) : (
            <Link to="/" className="flex items-center" aria-label="Ir para página inicial">
              <div className="font-museomoderno font-bold text-xl md:text-2xl text-econotrip-blue mr-2">
                ECONOTRIP
              </div>
              <span className="text-econotrip-orange font-medium text-base md:text-lg">PrimeVoyage</span>
            </Link>
          )}
        </div>

        {userName ? (
          <div className="text-base md:text-lg font-medium text-econotrip-blue">
            Olá, {userName}
          </div>
        ) : (
          <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-end">
            <Link 
              to="/login" 
              className="text-econotrip-blue hover:text-econotrip-blue/80 font-medium text-base md:text-lg touch-target py-2 px-3 md:px-4"
              aria-label="Entrar na sua conta"
            >
              Entrar
            </Link>
            <Link 
              to="/registro"
              className="bg-econotrip-orange hover:bg-econotrip-orange/90 text-white font-medium py-2 px-4 md:py-3 md:px-6 rounded-full text-base md:text-lg touch-target"
              aria-label="Criar nova conta"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
