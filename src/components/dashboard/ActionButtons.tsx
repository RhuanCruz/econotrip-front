
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Search, Route, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ActionButtons() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Buscar Passagens",
      icon: Search,
      route: "/busca-voos",
      color: "from-econotrip-orange to-econotrip-orange/80"
    },
    {
      title: "Ver Roteiro",
      icon: Route,
      route: "/meu-roteiro", 
      color: "from-econotrip-blue to-econotrip-blue/80"
    },
    {
      title: "Explorar Destinos",
      icon: MapPin,
      route: "/radar-ofertas",
      color: "from-econotrip-green to-econotrip-green/80"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-econotrip-blue text-center mb-6">
        O que você gostaria de fazer agora?
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-4 bg-gradient-to-r ${action.color} text-white shadow-lg border-0 rounded-2xl cursor-pointer`}
              onClick={() => navigate(action.route)}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">
                    {action.title}
                  </h3>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
