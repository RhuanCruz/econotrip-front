
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
import { useAuthStore } from "@/stores/authStore";

export default function DashboardScreen() {
  const navigate = useNavigate();

  const { user } = useAuthStore();

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
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4 pb-24">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Header moderno */}
          <motion.div variants={itemAnimation} className="text-center py-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Olá, {user.fullname.split(' ')[0]}! 👋
            </h1>
            <p className="text-base text-gray-600 text-balance px-2">
              Que bom ter você de volta! Pronta para sua próxima aventura?
            </p>
          </motion.div>

          {/* Dica motivacional moderna */}
          <motion.div variants={itemAnimation}>
            <div className="bg-gradient-to-r from-econotrip-green/10 to-econotrip-blue/10 rounded-2xl p-4 border border-econotrip-green/20 shadow-sm">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-econotrip-blue text-sm">Dica especial</h3>
                  <p className="text-xs text-gray-600">Para você hoje</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Janeiro e março são os meses ideais para economizar! Aproveite as promoções de início de ano.
              </p>
            </div>
          </motion.div>

          {/* Ações principais modernas */}
          <motion.div variants={itemAnimation}>
            <h2 className="text-base font-semibold text-econotrip-blue mb-3 flex items-center gap-2">
              <Plane className="h-4 w-4" />
              O que você quer fazer hoje?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className="p-4 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 border-l-4 border-l-econotrip-blue rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/busca-voos")}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-econotrip-blue mb-1 text-sm">Buscar Voos</h3>
                  <p className="text-xs text-gray-600">Encontre as melhores passagens</p>
                </div>
              </Card>

              <Card
                className="p-4 bg-gradient-to-br from-econotrip-orange/10 to-econotrip-orange/5 border-l-4 border-l-econotrip-orange rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/meu-roteiro")}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Route className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-econotrip-blue mb-1 text-sm">Meu Roteiro</h3>
                  <p className="text-xs text-gray-600">Planeje sua viagem</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Última viagem moderna
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-econotrip-orange" />
              <h2 className="text-base font-semibold text-econotrip-blue">
                Sua última aventura
              </h2>
            </div>
            <Card className="p-4 bg-gradient-to-r from-econotrip-orange/10 to-econotrip-blue/10 rounded-2xl shadow-sm border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-blue rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-econotrip-blue text-base truncate">Lisboa, Portugal</h3>
                    <p className="text-gray-600 text-sm">Dezembro 2023</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="font-semibold text-econotrip-blue text-sm">4.8</span>
                  </div>
                  <p className="text-xs text-gray-600">Avaliação</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                Uma viagem incrível! Os pastéis de nata e a arquitetura histórica foram os destaques.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/meu-roteiro")}
                className="w-full bg-white/80 text-econotrip-blue border-econotrip-blue/20 rounded-xl hover:bg-white text-sm"
              >
                Ver detalhes da viagem
              </Button>
            </Card>
          </motion.div> */}

          {/* Explorar categorias modernas */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-econotrip-green" />
              <h2 className="text-base font-semibold text-econotrip-blue">
                Explore novas aventuras
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className="p-3 bg-gradient-to-br from-econotrip-green/10 to-econotrip-green/5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/turismo-sustentavel")}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-blue text-xs mb-1">Turismo Sustentável</h4>
                  <p className="text-xs text-gray-600">Viaje consciente</p>
                </div>
              </Card>

              <Card
                className="p-3 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/meus-radares")}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-blue text-xs mb-1">Radar de Ofertas</h4>
                  <p className="text-xs text-gray-600">Não perca promoções</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Programa de fidelidade moderno */}
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-4 w-4 text-econotrip-green" />
              <h2 className="text-base font-semibold text-econotrip-blue">
                Programa Milhas Sênior
              </h2>
              <ContextualTooltip content="Com cada viagem você ganha pontos que podem ser trocados por descontos em passagens futuras!" />
            </div>
            <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 border-l-4 border-l-econotrip-green rounded-2xl shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-2xl font-bold text-econotrip-green">{pontosAtuais}</span>
                      <span className="text-base text-gray-600 ml-2">pontos</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Faltam apenas {metaProximoNivel - pontosAtuais} pontos para o próximo nível!
                  </p>
                </div>
                <div className="w-16 h-16 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pontosDistribuicao}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={32}
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
                className="h-2 mb-3 bg-gray-200 rounded-full" 
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/minha-evolucao")}
                  className="bg-white/80 text-econotrip-green border-econotrip-green/20 rounded-xl hover:bg-white text-sm w-full sm:w-auto"
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
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-semibold text-econotrip-blue flex items-center gap-2">
                <Award className="h-4 w-4" />
                Suas conquistas
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-gradient-to-br from-econotrip-green/10 to-econotrip-green/5 rounded-xl shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xl font-bold text-econotrip-green">R$ 240</p>
                  <p className="text-xs text-gray-600">Economia este ano</p>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 rounded-xl shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xl font-bold text-econotrip-blue">3</p>
                  <p className="text-xs text-gray-600">Viagens realizadas</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Dicas especiais modernas */}
          <motion.div variants={itemAnimation}>
            <h2 className="text-base font-semibold text-econotrip-blue mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dicas especiais para você
            </h2>
            <div className="space-y-3">
              <Card className="p-3 hover:shadow-md transition-all rounded-xl bg-white/80 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-econotrip-blue text-sm mb-1">Melhor época para economizar</h4>
                    <p className="text-xs text-gray-600">
                      Viagens entre janeiro e março oferecem os melhores preços
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 hover:shadow-md transition-all rounded-xl bg-white/80 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-econotrip-blue text-sm mb-1">Viaje com amigos</h4>
                    <p className="text-xs text-gray-600">
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
