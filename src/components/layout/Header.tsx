
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  userName?: string;
  variant?: "default" | "compact";
}

export function Header({ userName, variant = "default" }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if we should show back button based on the route
  const showBackButton = !["/", "/busca-voos", "/perfil", "/meu-roteiro", "/dashboard"].includes(location.pathname);
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 px-4 flex items-center justify-between w-full overflow-hidden">
      <div className="max-w-screen-sm mx-auto w-full flex items-center justify-between gap-x-4 flex-wrap">
        <div className="flex items-center min-w-0 flex-1">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="mr-2 p-2 rounded-full hover:bg-gray-100 touch-target flex-shrink-0"
              aria-label="Voltar para a tela anterior"
            >
              <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
            </button>
          ) : (
            <Link to="/dashboard" className="flex items-center min-w-0" aria-label="Ir para página inicial">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png" 
                  alt="EconoTrip"
                  className="h-8 w-8 rounded-md"
                />
                <div className="font-museomoderno font-bold text-lg md:text-xl text-econotrip-blue truncate">
                  EconoTrip
                </div>
              </div>
            </Link>
          )}
        </div>

        {userName ? (
          <div className="text-sm md:text-base font-medium text-econotrip-blue truncate max-w-32 md:max-w-none">
            Olá, {userName}
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link 
              to="/login" 
              className="text-econotrip-blue hover:text-econotrip-blue/80 font-medium text-sm md:text-base touch-target py-2 px-2 md:px-3"
              aria-label="Entrar na sua conta"
            >
              Entrar
            </Link>
            <Link 
              to="/registro"
              className="bg-econotrip-orange hover:bg-econotrip-orange/90 text-white font-medium py-2 px-3 md:px-4 rounded-full text-sm md:text-base touch-target"
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
