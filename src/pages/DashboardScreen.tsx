
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion } from "framer-motion";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Star,
  TrendingUp,
  Clock,
  Gift,
  Users,
  ArrowRight
} from "lucide-react";

export default function DashboardScreen() {
  const navigate = useNavigate();

  const pacotesDestaque = [
    {
      id: 1,
      destino: "Rio de Janeiro",
      preco: "R$ 480",
      desconto: "15% OFF",
      imagem: "🏖️",
      tipo: "Lazer"
    },
    {
      id: 2,
      destino: "Salvador",
      preco: "R$ 320",
      desconto: "20% OFF",
      imagem: "🎭",
      tipo: "Cultural"
    },
    {
      id: 3,
      destino: "Fortaleza",
      preco: "R$ 290",
      desconto: "12% OFF",
      imagem: "🌊",
      tipo: "Descanso"
    }
  ];

  const proximasViagens = [
    {
      destino: "Rio de Janeiro",
      data: "15 Jan 2025",
      status: "Confirmada"
    }
  ];

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header de boas-vindas */}
        <motion.div variants={itemAnimation} className="text-center">
          <h1 className="text-2xl font-semibold text-econotrip-blue mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-base text-muted-foreground">
            Explore novas oportunidades de viagem
          </p>
        </motion.div>

        {/* Próximas viagens */}
        {proximasViagens.length > 0 && (
          <motion.div variants={itemAnimation}>
            <h2 className="text-lg font-medium text-econotrip-blue mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Suas Próximas Viagens
            </h2>
            <Card className="p-4">
              {proximasViagens.map((viagem, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-econotrip-blue">{viagem.destino}</h3>
                    <p className="text-sm text-muted-foreground">{viagem.data}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {viagem.status}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate("/meu-roteiro")}
                    >
                      Ver roteiro
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {/* Ações rápidas */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-lg font-medium text-econotrip-blue mb-3">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={Plane}
              onClick={() => navigate("/busca-voos")}
              className="h-16 flex-col"
            >
              <span className="text-base">Buscar Voos</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={MapPin}
              onClick={() => navigate("/meu-roteiro")}
              className="h-16 flex-col"
            >
              <span className="text-base">Meu Roteiro</span>
            </Button>
          </div>
        </motion.div>

        {/* Pacotes em destaque */}
        <motion.div variants={itemAnimation}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-econotrip-blue flex items-center gap-2">
              <Star className="h-5 w-5" />
              Ofertas Especiais
            </h2>
            <Button
              variant="secondary"
              size="sm"
              iconPosition="right"
              icon={ArrowRight}
              onClick={() => navigate("/busca-voos")}
            >
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-3">
            {pacotesDestaque.map((pacote) => (
              <Card key={pacote.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {pacote.imagem}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-econotrip-blue">{pacote.destino}</h3>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {pacote.desconto}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{pacote.tipo}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-econotrip-blue">
                        {pacote.preco}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("/busca-voos")}
                      >
                        Ver oferta
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Status da conta */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-lg font-medium text-econotrip-blue mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Programa Milhas Sênior
          </h2>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-econotrip-blue">Seus Pontos</h3>
                <p className="text-2xl font-bold text-green-600">180 pontos</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/fidelidade")}
              >
                Ver programa
              </Button>
            </div>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Faltam 120 pontos para o próximo nível
            </p>
          </Card>
        </motion.div>

        {/* Dicas e tendências */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-lg font-medium text-econotrip-blue mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dicas de Viagem
          </h2>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-econotrip-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Melhor época para viajar</h4>
                  <p className="text-xs text-muted-foreground">
                    Janeiro a Março oferece os melhores preços para destinos nacionais
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-econotrip-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Viagens em grupo</h4>
                  <p className="text-xs text-muted-foreground">
                    Economize até 25% viajando com amigos ou família
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
