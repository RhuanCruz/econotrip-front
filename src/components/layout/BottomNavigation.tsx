
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Plane,
  User,
  HelpCircle,
  MapPin,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    { 
      name: 'Início', 
      icon: Home, 
      route: '/dashboard', 
      isActive: location.pathname === '/dashboard'
    },
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
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="max-w-screen-sm mx-auto px-2">
        <ul className="flex justify-around items-center">
          {navigationItems.map((item) => (
            <li key={item.name} className="flex-1">
              <motion.button
                onClick={() => navigate(item.route)}
                className={cn(
                  "w-full py-3 flex flex-col items-center justify-center touch-target transition-colors",
                  item.isActive 
                    ? "text-econotrip-blue" 
                    : "text-gray-400 hover:text-gray-600"
                )}
                aria-label={`Navegar para ${item.name}`}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 mb-1",
                    item.isActive ? "text-econotrip-blue" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                <span className={cn(
                  "text-xs font-medium",
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
