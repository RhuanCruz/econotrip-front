import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Plane,
  MapPin,
  Home,
  Search,
  TrendingUp
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
      icon: Search, 
      route: '/busca-voos', 
      isActive: location.pathname === '/busca-voos' || location.pathname === '/resultados-voos' || location.pathname === '/detalhes-voo'
    },
    {
      name: 'Radar',
      icon: Plane, // Substitua por Radar se houver um ícone mais adequado
      route: '/meus-radares', // Agora leva para a tela de listagem de radares
      isActive: location.pathname === '/meus-radares' || location.pathname === '/radar-ofertas'
    },
    { 
      name: 'Simulador', 
      icon: MapPin, 
      route: '/meu-roteiro', 
      isActive: location.pathname === '/meu-roteiro'
    }
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-2xl z-50 pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="max-w-screen-sm mx-auto px-2">
        <div className="flex justify-around items-center relative">
          {navigationItems.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => navigate(item.route)}
              className={cn(
                "relative flex flex-col items-center justify-center py-3 px-4 min-w-[64px] touch-target transition-all duration-200",
                item.isActive 
                  ? "text-econotrip-primary" 
                  : "text-gray-400 hover:text-gray-600"
              )}
              aria-label={`Navegar para ${item.name}`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: item.isActive ? 1.1 : 1,
                  rotateY: item.isActive ? 360 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 mb-1 transition-colors",
                    item.isActive ? "text-econotrip-primary drop-shadow-sm" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
              </motion.div>
              <span className={cn(
                "text-xs font-medium transition-all",
                item.isActive ? "font-semibold text-econotrip-primary" : "text-gray-500"
              )}>
                {item.name}
              </span>
              
              {/* Active indicator dot */}
              {item.isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-econotrip-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
