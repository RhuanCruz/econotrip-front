
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
      <div className="text-center">
        <h2 className="text-xl font-semibold text-econotrip-blue mb-2">
          Qual o motivo principal da sua viagem?
        </h2>
        <p className="text-base text-gray-600">
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
              onClick={() => onSelect(objetivo.id)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-econotrip-blue/30 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${objetivo.color}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-econotrip-blue">
                      {objetivo.titulo}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {objetivo.descricao}
                    </p>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="default"
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
