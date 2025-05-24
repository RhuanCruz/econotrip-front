
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Plane,
  User,
  Star,
  HelpCircle,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    { 
      name: 'Buscar', 
      icon: Plane, 
      route: '/busca-voos', 
      isActive: location.pathname === '/busca-voos' || location.pathname === '/resultados-voos' || location.pathname === '/detalhes-voo'
    },
    { 
      name: 'Roteiro', 
      icon: MapPin, 
      route: '/meu-roteiro', 
      isActive: location.pathname === '/meu-roteiro'
    },
    { 
      name: 'Perfil', 
      icon: User, 
      route: '/perfil', 
      isActive: location.pathname === '/perfil' || location.pathname === '/editar-perfil' 
    },
    { 
      name: 'Ajuda', 
      icon: HelpCircle, 
      route: '/suporte', 
      isActive: location.pathname === '/suporte' 
    },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="max-w-xl mx-auto px-4">
        <ul className="flex justify-around items-center">
          {navigationItems.map((item) => (
            <li key={item.name} className="flex-1">
              <motion.button
                onClick={() => navigate(item.route)}
                className={cn(
                  "w-full py-4 flex flex-col items-center justify-center touch-target transition-colors",
                  item.isActive 
                    ? "text-econotrip-blue" 
                    : "text-gray-400 hover:text-gray-600"
                )}
                aria-label={`Navegar para ${item.name}`}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon
                  className={cn(
                    "h-7 w-7 mb-1",
                    item.isActive ? "text-econotrip-blue" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                <span className={cn(
                  "text-base font-medium",
                  item.isActive ? "font-semibold" : ""
                )}>
                  {item.name}
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
