
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Progress } from "@/components/ui/progress";
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
  Search,
  Route,
  Award,
  Coins,
  BarChart3,
  Heart,
  Globe
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";
import { MotivationalHint } from "@/components/ui-custom/MotivationalHint";

export default function DashboardScreen() {
  const navigate = useNavigate();

  // Dados do programa de fidelidade
  const pontosAtuais = 180;
  const metaProximoNivel = 300;
  const progressoPontos = (pontosAtuais / metaProximoNivel) * 100;

  // Dados para gráfico de distribuição de pontos
  const pontosDistribuicao = [
    { name: "Pontos Atuais", value: pontosAtuais, fill: "#A1C181" },
    { name: "Para Próximo Nível", value: metaProximoNivel - pontosAtuais, fill: "#E5E5E5" }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header moderno */}
          <motion.div variants={itemAnimation} className="text-center py-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Olá, Maria! 👋
            </h1>
            <p className="text-lg text-gray-600 text-balance">
              Que bom ter você de volta! Pronta para sua próxima aventura?
            </p>
          </motion.div>

          {/* Dica motivacional moderna */}
          <motion.div variants={itemAnimation}>
            <div className="bg-gradient-to-r from-econotrip-green/10 to-econotrip-blue/10 rounded-3xl p-6 border border-econotrip-green/20 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-2xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-econotrip-blue">Dica especial</h3>
                  <p className="text-sm text-gray-600">Para você hoje</p>
                </div>
              </div>
              <p className="text-gray-700">
                Janeiro e março são os meses ideais para economizar! Aproveite as promoções de início de ano.
              </p>
            </div>
          </motion.div>

          {/* Ações principais modernas */}
          <motion.div variants={itemAnimation}>
            <h2 className="text-lg font-semibold text-econotrip-blue mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5" />
              O que você quer fazer hoje?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="p-6 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 border-l-4 border-l-econotrip-blue rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                onClick={() => navigate("/busca-voos")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-econotrip-blue mb-2">Buscar Voos</h3>
                  <p className="text-sm text-gray-600">Encontre as melhores passagens</p>
                </div>
              </Card>

              <Card
                className="p-6 bg-gradient-to-br from-econotrip-orange/10 to-econotrip-orange/5 border-l-4 border-l-econotrip-orange rounded-3xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                onClick={() => navigate("/meu-roteiro")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Route className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-econotrip-blue mb-2">Meu Roteiro</h3>
                  <p className="text-sm text-gray-600">Planeje sua viagem</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Última viagem moderna */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-econotrip-orange" />
              <h2 className="text-lg font-semibold text-econotrip-blue">
                Sua última aventura
              </h2>
            </div>
            <Card className="p-6 bg-gradient-to-r from-econotrip-orange/10 to-econotrip-blue/10 rounded-3xl shadow-lg border-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-econotrip-orange to-econotrip-blue rounded-2xl flex items-center justify-center shadow-lg">
                    <Plane className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-econotrip-blue text-lg">Lisboa, Portugal</h3>
                    <p className="text-gray-600">Dezembro 2023</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-econotrip-blue">4.8</span>
                  </div>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Uma viagem incrível! Os pastéis de nata e a arquitetura histórica foram os destaques.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/meu-roteiro")}
                className="w-full bg-white/80 text-econotrip-blue border-econotrip-blue/20 rounded-xl hover:bg-white"
              >
                Ver detalhes da viagem
              </Button>
            </Card>
          </motion.div>

          {/* Explorar categorias modernas */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-econotrip-green" />
              <h2 className="text-lg font-semibold text-econotrip-blue">
                Explore novas aventuras
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="p-4 bg-gradient-to-br from-econotrip-green/10 to-econotrip-green/5 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                onClick={() => navigate("/turismo-sustentavel")}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-blue text-sm mb-1">Turismo Sustentável</h4>
                  <p className="text-xs text-gray-600">Viaje consciente</p>
                </div>
              </Card>

              <Card
                className="p-4 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
                onClick={() => navigate("/radar-ofertas")}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-blue text-sm mb-1">Radar de Ofertas</h4>
                  <p className="text-xs text-gray-600">Não perca promoções</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Programa de fidelidade moderno */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-econotrip-green" />
              <h2 className="text-lg font-semibold text-econotrip-blue">
                Programa Milhas Sênior
              </h2>
              <ContextualTooltip content="Com cada viagem você ganha pontos que podem ser trocados por descontos em passagens futuras!" />
            </div>
            <Card className="p-6 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 border-l-4 border-l-econotrip-green rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <Coins className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-econotrip-green">{pontosAtuais}</span>
                      <span className="text-lg text-gray-600 ml-2">pontos</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Faltam apenas {metaProximoNivel - pontosAtuais} pontos para o próximo nível!
                  </p>
                </div>
                <div className="w-20 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pontosDistribuicao}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        startAngle={90}
                        endAngle={450}
                        dataKey="value"
                      >
                        {pontosDistribuicao.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <Progress 
                value={progressoPontos} 
                className="h-3 mb-4 bg-gray-200 rounded-full" 
              />
              
              <div className="flex justify-between items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/minha-evolucao")}
                  className="bg-white/80 text-econotrip-green border-econotrip-green/20 rounded-xl hover:bg-white"
                >
                  Ver evolução completa
                </Button>
                <div className="text-sm text-gray-600 font-medium">
                  Nível atual: <span className="text-econotrip-green">Prata</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Conquistas modernas */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-econotrip-blue flex items-center gap-2">
                <Award className="h-5 w-5" />
                Suas conquistas
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-econotrip-green/10 to-econotrip-green/5 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-econotrip-green">R$ 240</p>
                  <p className="text-sm text-gray-600">Economia este ano</p>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 rounded-2xl shadow-lg">
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Plane className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-econotrip-blue">3</p>
                  <p className="text-sm text-gray-600">Viagens realizadas</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Dicas especiais modernas */}
          <motion.div variants={itemAnimation}>
            <h2 className="text-lg font-semibold text-econotrip-blue mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dicas especiais para você
            </h2>
            <div className="space-y-3">
              <Card className="p-4 hover:shadow-lg transition-all rounded-2xl bg-white/80 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-econotrip-blue text-base mb-1">Melhor época para economizar</h4>
                    <p className="text-sm text-gray-600">
                      Viagens entre janeiro e março oferecem os melhores preços
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 hover:shadow-lg transition-all rounded-2xl bg-white/80 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-econotrip-blue text-base mb-1">Viaje com amigos</h4>
                    <p className="text-sm text-gray-600">
                      Grupos de 4 ou mais pessoas ganham descontos especiais
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
