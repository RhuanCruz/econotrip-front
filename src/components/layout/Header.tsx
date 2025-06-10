
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  variant?: "default" | "compact";
}

export function Header({ userName, variant = "default" }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Determine if we should show back button based on the route
  const showBackButton = !["/", "/busca-voos", "/perfil", "/meu-roteiro", "/dashboard"].includes(location.pathname);
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logout clicked");
    navigate("/");
  };

  const isLoggedIn = !!userName;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 px-3 md:px-6 flex items-center justify-between w-full">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 touch-target flex-shrink-0"
              aria-label="Voltar para a tela anterior"
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-econotrip-blue" />
            </button>
          ) : (
            <Link to="/dashboard" className="flex items-center min-w-0" aria-label="Ir para página inicial">
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png" 
                  alt="EconoTrip"
                  className="h-7 w-7 md:h-8 md:w-8 rounded-md flex-shrink-0"
                />
                <div className="font-museomoderno font-bold text-base md:text-lg lg:text-xl text-econotrip-blue truncate">
                  EconoTrip
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* User Menu - When logged in */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 md:gap-4">
            {/* Welcome message - hidden on small screens */}
            <div className="hidden md:block text-sm lg:text-base font-medium text-econotrip-blue">
              Olá, {userName}
            </div>
            
            {/* User menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 touch-target">
                  <div className="h-8 w-8 md:h-9 md:w-9 bg-econotrip-orange/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-econotrip-orange" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-gray-600">Minha conta</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <div className="font-medium text-econotrip-blue">{userName}</div>
                  <div className="text-sm text-gray-500">maria@exemplo.com</div>
                </div>
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/editar-perfil")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/fidelidade")}>
                  <div className="mr-2 h-4 w-4 text-econotrip-green">★</div>
                  <span>Programa de Fidelidade</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/suporte")}>
                  <div className="mr-2 h-4 w-4">?</div>
                  <span>Suporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          /* Login/Register buttons - When not logged in */
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link 
              to="/login" 
              className="text-econotrip-blue hover:text-econotrip-blue/80 font-medium text-sm md:text-base touch-target py-2 px-2 md:px-3 rounded-md hover:bg-gray-100"
              aria-label="Entrar na sua conta"
            >
              Entrar
            </Link>
            <Link 
              to="/registro"
              className="bg-econotrip-orange hover:bg-econotrip-orange/90 text-white font-medium py-2 px-3 md:px-4 rounded-full text-sm md:text-base touch-target whitespace-nowrap"
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
