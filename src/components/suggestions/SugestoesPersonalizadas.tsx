
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Mountain, Building, Heart, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Sugestao {
  id: string;
  titulo: string;
  descricao: string;
  destino: string;
  preco: string;
  categoria: string;
  icon: React.ComponentType<any>;
}

interface SugestoesPersonalizadasProps {
  preferencias: string[];
  onSelectSugestao: (sugestao: Sugestao) => void;
}

export function SugestoesPersonalizadas({ preferencias, onSelectSugestao }: SugestoesPersonalizadasProps) {
  const todasSugestoes: Sugestao[] = [
    {
      id: "1",
      titulo: "Viagem tranquila na Serra Gaúcha",
      descricao: "Paisagens lindas, vinículas e pouca caminhada",
      destino: "Gramado e Canela",
      preco: "A partir de R$ 1.200",
      categoria: "natureza",
      icon: Mountain,
    },
    {
      id: "2",
      titulo: "História e cultura em Minas Gerais",
      descricao: "Explore Ouro Preto e cidades históricas",
      destino: "Ouro Preto",
      preco: "A partir de R$ 980",
      categoria: "cultura",
      icon: Building,
    },
    {
      id: "3",
      titulo: "Relaxamento em águas termais",
      descricao: "Spa natural e descanso em Caldas Novas",
      destino: "Caldas Novas",
      preco: "A partir de R$ 1.100",
      categoria: "descanso",
      icon: Heart,
    },
    {
      id: "4",
      titulo: "Sabores do Nordeste",
      descricao: "Gastronomia típica e cultura regional",
      destino: "Salvador",
      preco: "A partir de R$ 1.400",
      categoria: "gastronomia",
      icon: Building,
    },
  ];

  const sugestoesFiltradas = preferencias.length > 0 
    ? todasSugestoes.filter(s => preferencias.includes(s.categoria))
    : todasSugestoes.slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue">
          Sugestões personalizadas para você
        </h2>
      </div>

      <div className="space-y-4">
        {sugestoesFiltradas.map((sugestao, index) => {
          const Icon = sugestao.icon;
          return (
            <motion.div
              key={sugestao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onSelectSugestao(sugestao)}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-econotrip-blue/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-econotrip-blue" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-econotrip-blue mb-1">
                      {sugestao.titulo}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {sugestao.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{sugestao.destino}</p>
                        <p className="text-econotrip-orange font-medium">{sugestao.preco}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-econotrip-blue" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
        >
          Ver todos os roteiros personalizados
        </Button>
      </div>
    </div>
  );
}
