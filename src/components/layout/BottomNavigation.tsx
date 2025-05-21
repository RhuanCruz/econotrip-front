
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Plane,
  User,
  Star,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Routes that should hide the bottom navigation
  const hiddenRoutes = [
    '/login', 
    '/registro', 
    '/recuperar-senha', 
    '/checkout', 
    '/confirmacao',
    '/'
  ];
  
  // If current route is in hiddenRoutes, hide bottom navigation
  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const navigationItems = [
    { 
      name: 'Buscar', 
      icon: Plane, 
      route: '/busca-voos', 
      isActive: location.pathname === '/busca-voos' || location.pathname === '/resultados-voos' 
    },
    { 
      name: 'Perfil', 
      icon: User, 
      route: '/perfil', 
      isActive: location.pathname === '/perfil' || location.pathname === '/editar-perfil' 
    },
    { 
      name: 'Fidelidade', 
      icon: Star, 
      route: '/fidelidade', 
      isActive: location.pathname === '/fidelidade' 
    },
    { 
      name: 'Ajuda', 
      icon: HelpCircle, 
      route: '/suporte', 
      isActive: location.pathname === '/suporte' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-around items-center">
          {navigationItems.map((item) => (
            <li key={item.name} className="flex-1">
              <button
                onClick={() => navigate(item.route)}
                className={cn(
                  "w-full py-4 flex flex-col items-center justify-center touch-target transition-colors",
                  item.isActive 
                    ? "text-econotrip-blue" 
                    : "text-gray-400 hover:text-gray-600"
                )}
                aria-label={`Navegar para ${item.name}`}
              >
                <item.icon
                  className={cn(
                    "h-7 w-7 mb-1",
                    item.isActive ? "text-econotrip-blue" : "text-gray-400"
                  )}
                  aria-hidden="true"
                />
                <span className={cn(
                  "text-sm font-medium",
                  item.isActive ? "font-semibold" : ""
                )}>
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
