
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { MapPin, Navigation, Phone, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface PontoInteresse {
  id: string;
  nome: string;
  categoria: "aeroporto" | "hotel" | "restaurante" | "farmacia" | "hospital";
  endereco: string;
  distancia: string;
  telefone?: string;
}

export function MapaDoDestino() {
  const pontosDeInteresse: PontoInteresse[] = [
    {
      id: "1",
      nome: "Aeroporto Internacional",
      categoria: "aeroporto",
      endereco: "Rod. BR-101, Km 12",
      distancia: "25 km do hotel",
      telefone: "(11) 3555-0100",
    },
    {
      id: "2", 
      nome: "Hotel Pousada do Sol",
      categoria: "hotel",
      endereco: "Rua das Flores, 123 - Centro",
      distancia: "Sua hospedagem",
      telefone: "(11) 3333-4444",
    },
    {
      id: "3",
      nome: "Restaurante Sabores Locais",
      categoria: "restaurante",
      endereco: "Av. Principal, 456",
      distancia: "300m do hotel",
      telefone: "(11) 3222-5555",
    },
    {
      id: "4",
      nome: "Farmácia 24h Central",
      categoria: "farmacia",
      endereco: "Rua do Comércio, 789",
      distancia: "500m do hotel",
      telefone: "(11) 3111-6666",
    },
    {
      id: "5",
      nome: "Hospital Municipal",
      categoria: "hospital",
      endereco: "Av. da Saúde, 321",
      distancia: "2 km do hotel",
      telefone: "(11) 190",
    },
  ];

  const getIconByCategoria = (categoria: string) => {
    switch (categoria) {
      case "aeroporto": return "✈️";
      case "hotel": return "🏨";
      case "restaurante": return "🍽️";
      case "farmacia": return "💊";
      case "hospital": return "🏥";
      default: return "📍";
    }
  };

  const getColorByCategoria = (categoria: string) => {
    switch (categoria) {
      case "aeroporto": return "border-blue-300 bg-blue-50";
      case "hotel": return "border-green-300 bg-green-50";
      case "restaurante": return "border-orange-300 bg-orange-50";
      case "farmacia": return "border-purple-300 bg-purple-50";
      case "hospital": return "border-red-300 bg-red-50";
      default: return "border-gray-300 bg-gray-50";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
          Mapa do seu destino
        </h2>
      </div>

      {/* Mapa simulado */}
      <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl p-8 mb-6 text-center min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-econotrip-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold text-econotrip-blue mb-2">
            Mapa Interativo
          </h3>
          <p className="text-gray-600 text-lg">
            Visualização do destino com pontos de interesse
          </p>
          <Button
            variant="primary"
            icon={Navigation}
            className="mt-4"
          >
            Abrir navegação
          </Button>
        </div>
      </div>

      {/* Lista de pontos de interesse */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-econotrip-blue mb-4">
          Locais importantes próximos a você
        </h3>
        
        {pontosDeInteresse.map((ponto, index) => (
          <motion.div
            key={ponto.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-2 ${getColorByCategoria(ponto.categoria)}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {getIconByCategoria(ponto.categoria)}
              </div>
              
              <div className="flex-1">
                <h4 className="text-lg font-bold text-econotrip-blue mb-1">
                  {ponto.nome}
                </h4>
                <p className="text-gray-700 mb-1">
                  📍 {ponto.endereco}
                </p>
                <p className="text-gray-600 mb-3">
                  📏 {ponto.distancia}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Navigation}
                    className="text-sm"
                  >
                    Como chegar
                  </Button>
                  
                  {ponto.telefone && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Phone}
                      className="text-sm"
                    >
                      {ponto.telefone}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-blue-800 text-center text-lg">
          💡 <strong>Dica:</strong> Salve estes locais no seu celular para facilitar a navegação durante a viagem!
        </p>
      </div>
    </Card>
  );
}
