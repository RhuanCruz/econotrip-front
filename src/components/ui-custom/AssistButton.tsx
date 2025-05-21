
import React from "react";
import { useLocation } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AssistButtonProps {
  tooltipText?: string;
  onClick?: () => void;
}

export function AssistButton({ tooltipText = "Ajuda", onClick }: AssistButtonProps) {
  const location = useLocation();
  
  // Define routes where the assist button should appear
  const activeRoutes = [
    "/login", 
    "/registro", 
    "/recuperar-senha", 
    "/busca-voos", 
    "/editar-perfil",
    "/checkout"
  ];
  
  // Show button only on specified routes
  const showAssist = activeRoutes.some(route => location.pathname === route || location.pathname.startsWith(route));
  
  if (!showAssist) return null;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior if no onClick is provided
      alert("Assistente de ajuda será aberto aqui.");
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors touch-target"
              aria-label={tooltipText}
              onClick={handleClick}
            >
              <HelpCircle className="h-7 w-7" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
