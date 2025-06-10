
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
  ArrowRight,
  Zap
} from "lucide-react";

export default function DashboardScreen() {
  const navigate = useNavigate();

  const pacotesDestaque = [
    {
      id: 1,
      destino: "Rio de Janeiro",
      preco: "R$ 480",
      desconto: "15% OFF",
      tipo: "Lazer",
      cor: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      destino: "Salvador",
      preco: "R$ 320",
      desconto: "20% OFF",
      tipo: "Cultural",
      cor: "from-purple-500 to-pink-400"
    },
    {
      id: 3,
      destino: "Fortaleza",
      preco: "R$ 290",
      desconto: "12% OFF",
      tipo: "Descanso",
      cor: "from-green-500 to-emerald-400"
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
        {/* Header simplificado sem redundância */}
        <motion.div variants={itemAnimation} className="text-center py-2">
          <h1 className="text-xl font-medium text-econotrip-blue mb-1">
            Bem-vindo de volta, Maria!
          </h1>
          <p className="text-sm text-gray-600">
            Explore novas oportunidades de viagem
          </p>
        </motion.div>

        {/* Próximas viagens - mais compacto */}
        {proximasViagens.length > 0 && (
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-econotrip-blue" />
              <h2 className="text-base font-medium text-econotrip-blue">
                Sua Próxima Viagem
              </h2>
            </div>
            <Card className="p-4 bg-gradient-to-r from-econotrip-blue/5 to-econotrip-orange/5 border-l-4 border-l-econotrip-orange">
              {proximasViagens.map((viagem, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-econotrip-blue text-sm">{viagem.destino}</h3>
                    <p className="text-xs text-gray-600">{viagem.data}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-econotrip-green/20 text-econotrip-green px-2 py-1 rounded-full font-medium">
                      {viagem.status}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate("/meu-roteiro")}
                      className="text-xs"
                    >
                      Ver roteiro
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {/* Ações rápidas redesenhadas */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-base font-medium text-econotrip-blue mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={Plane}
                onClick={() => navigate("/busca-voos")}
                className="h-20 flex-col bg-gradient-to-br from-econotrip-orange to-econotrip-orange/80 shadow-lg border-0"
              >
                <span className="text-base font-medium">Buscar Voos</span>
                <span className="text-xs opacity-90">Encontre as melhores ofertas</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="secondary"
                size="lg"
                icon={MapPin}
                onClick={() => navigate("/meu-roteiro")}
                className="h-20 flex-col bg-gradient-to-br from-econotrip-blue to-econotrip-blue/80 text-white shadow-lg border-0"
              >
                <span className="text-base font-medium">Meu Roteiro</span>
                <span className="text-xs opacity-90">Organize sua viagem</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Ofertas redesenhadas - mais modernas */}
        <motion.div variants={itemAnimation}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium text-econotrip-blue flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ofertas Especiais
            </h2>
            <Button
              variant="secondary"
              size="sm"
              iconPosition="right"
              icon={ArrowRight}
              onClick={() => navigate("/busca-voos")}
              className="text-xs"
            >
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-3">
            {pacotesDestaque.map((pacote) => (
              <motion.div
                key={pacote.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`p-4 bg-gradient-to-r ${pacote.cor} text-white shadow-lg border-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{pacote.destino}</h3>
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {pacote.desconto}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mb-2">{pacote.tipo}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">
                          {pacote.preco}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate("/busca-voos")}
                          className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs"
                        >
                          Ver oferta
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Programa de fidelidade mais compacto */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-base font-medium text-econotrip-blue mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Programa Milhas Sênior
          </h2>
          <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 border-l-4 border-l-econotrip-green">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-econotrip-blue text-sm">Seus Pontos</h3>
                <p className="text-xl font-bold text-econotrip-green">180 pontos</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/fidelidade")}
                className="text-xs"
              >
                Ver programa
              </Button>
            </div>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-econotrip-green h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-600">
              Faltam 120 pontos para o próximo nível
            </p>
          </Card>
        </motion.div>

        {/* Dicas mais compactas */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-base font-medium text-econotrip-blue mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dicas de Viagem
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <Card className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-econotrip-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Melhor época para viajar</h4>
                  <p className="text-xs text-gray-600">
                    Janeiro a Março oferece os melhores preços
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-econotrip-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Viagens em grupo</h4>
                  <p className="text-xs text-gray-600">
                    Economize até 25% viajando com amigos
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
