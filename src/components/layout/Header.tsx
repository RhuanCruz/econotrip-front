import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User as UserType } from "@/api/user/types";
import { useAuthStore } from "@/stores/authStore";

interface HeaderProps {
  user?: UserType;
  variant?: "default" | "compact";
}
export function Header({
  user,
  variant = "default"
}: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  // Determine if we should show back button based on the route
  const showBackButton = !["/", "/busca-voos", "/perfil", "/meu-roteiro", "/dashboard", "/meus-radares", "/minha-evolucao"].includes(location.pathname);
  const handleBack = () => {
    navigate(-1);
  };
  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logout clicked");
    logout();
    navigate("/");
  };
  const isLoggedIn = !!user;
  return <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm h-16 px-3 md:px-6 flex items-center justify-between w-full">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          {showBackButton && (
            <button 
              onClick={handleBack} 
              className="mr-3 p-2 rounded-full hover:bg-gray-100 touch-target flex-shrink-0 transition-colors" 
              aria-label="Voltar para a tela anterior"
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-econotrip-blue" />
            </button>
          )}
          <Link to="/dashboard" className="flex items-center min-w-0" aria-label="Ir para página inicial">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png" alt="EconoTrip" className="h-8 w-8 md:h-9 md:w-9 rounded-lg flex-shrink-0 shadow-sm" />
              <div className="font-museomoderno font-bold text-lg md:text-xl text-econotrip-blue truncate">
                EconoTrip
              </div>
            </div>
          </Link>
        </div>

        {/* User Menu - When logged in */}
        {isLoggedIn ? <div className="flex items-center gap-2 md:gap-4">
            {/* Welcome message - hidden on small screens */}
            
            
            {/* User menu dropdown - mais moderno */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-econotrip-blue-light/10 touch-target transition-all duration-200 group">
                  <div className="h-9 w-9 md:h-10 md:w-10 bg-gradient-to-br from-econotrip-blue-light to-econotrip-blue-light/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-gray-600 font-medium">Minha conta</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 shadow-xl border-gray-100">
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="font-medium text-econotrip-blue">{user.fullname}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <DropdownMenuItem onClick={() => navigate("/perfil")} className="hover:bg-econotrip-orange/10">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/editar-perfil")} className="hover:bg-econotrip-orange/10">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => navigate("/fidelidade")} className="hover:bg-econotrip-orange/10">
                  <div className="mr-2 h-4 w-4 text-econotrip-green">★</div>
                  <span>Programa de Fidelidade</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => navigate("/suporte")} className="hover:bg-econotrip-orange/10">
                  <div className="mr-2 h-4 w-4">?</div>
                  <span>Suporte</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> : (/* Login/Register buttons - When not logged in */
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <Link to="/login" className="text-econotrip-blue hover:text-econotrip-blue/80 font-medium text-sm md:text-base touch-target py-2 px-2 md:px-3 rounded-lg hover:bg-econotrip-blue/10 transition-colors" aria-label="Entrar na sua conta">
              Entrar
            </Link>
            <Link to="/registro" className="bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 hover:from-econotrip-orange/90 hover:to-econotrip-orange/80 text-white font-medium py-2 px-3 md:px-4 rounded-xl text-sm md:text-base touch-target whitespace-nowrap shadow-md hover:shadow-lg transition-all" aria-label="Criar nova conta">
              Cadastrar
            </Link>
          </div>)}
      </div>
    </header>;
}