
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Building2, Waves, Accessibility, Coins } from "lucide-react";
import { motion } from "framer-motion";

export function ExploreCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Culturais",
      icon: Building2,
      description: "Museus e patrimônios",
      color: "from-purple-500 to-purple-400",
      route: "/busca-voos?category=cultural"
    },
    {
      title: "Praias",
      icon: Waves,
      description: "Destinos paradisíacos",
      color: "from-blue-500 to-cyan-400",
      route: "/busca-voos?category=beach"
    },
    {
      title: "Acessíveis",
      icon: Accessibility,
      description: "Totalmente adaptados",
      color: "from-green-500 to-emerald-400",
      route: "/busca-voos?category=accessible"
    },
    {
      title: "Econômicas",
      icon: Coins,
      description: "Melhores preços",
      color: "from-econotrip-orange to-yellow-400",
      route: "/busca-voos?category=budget"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-base font-medium text-econotrip-blue">
        Categorias para Explorar
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(category.route)}
            className="cursor-pointer"
          >
            <Card className={`p-4 bg-gradient-to-br ${category.color} text-white shadow-lg border-0 rounded-2xl`}>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {category.title}
                  </h3>
                  <p className="text-xs text-white/80">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
