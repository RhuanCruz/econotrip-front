
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Heart, Users, Activity, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface ObjetivoDeViagemSelectorProps {
  onSelect: (objetivo: string) => void;
}

export function ObjetivoDeViagemSelector({ onSelect }: ObjetivoDeViagemSelectorProps) {
  const objetivos = [
    {
      id: "descanso",
      titulo: "Descanso e lazer",
      descricao: "Relaxar, curtir paisagens e ter momentos de paz",
      icon: Heart,
      color: "text-green-600",
    },
    {
      id: "familia",
      titulo: "Rever família ou amigos",
      descricao: "Encontrar pessoas queridas e fortalecer laços",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "saude",
      titulo: "Saúde e bem-estar",
      descricao: "Cuidar da saúde física e mental",
      icon: Activity,
      color: "text-red-600",
    },
    {
      id: "cultura",
      titulo: "Conhecer cultura/local",
      descricao: "Explorar história, gastronomia e tradições",
      icon: MapPin,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-econotrip-blue mb-4">
          Qual o motivo principal da sua viagem?
        </h2>
        <p className="text-lg text-gray-600">
          Isso nos ajuda a personalizar seu roteiro perfeitamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objetivos.map((objetivo, index) => {
          const Icon = objetivo.icon;
          return (
            <motion.div
              key={objetivo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-econotrip-blue/30">
                <div 
                  className="flex flex-col items-center text-center space-y-4"
                  onClick={() => onSelect(objetivo.id)}
                >
                  <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${objetivo.color}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-econotrip-blue mb-2">
                      {objetivo.titulo}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {objetivo.descricao}
                    </p>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(objetivo.id);
                    }}
                  >
                    Escolher este objetivo
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
