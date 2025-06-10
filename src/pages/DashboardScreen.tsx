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
  BarChart3
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

  // Dados do programa de fidelidade
  const pontosAtuais = 180;
  const metaProximoNivel = 300;
  const progressoPontos = (pontosAtuais / metaProximoNivel) * 100;

  // Dados para gráfico de distribuição de pontos
  const pontosDistribuicao = [
    { name: "Pontos Atuais", value: pontosAtuais, fill: "#A1C181" },
    { name: "Para Próximo Nível", value: metaProximoNivel - pontosAtuais, fill: "#E5E5E5" }
  ];

  // Dados para histórico de pontos
  const historicoPontos = [
    { mes: "Out", pontos: 50 },
    { mes: "Nov", pontos: 120 },
    { mes: "Dez", pontos: 160 },
    { mes: "Jan", pontos: 180 }
  ];

  const chartConfig = {
    pontos: {
      label: "Pontos",
      color: "#A1C181",
    },
  };

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
        {/* Header melhorado */}
        <motion.div variants={itemAnimation} className="text-center py-2">
          <h1 className="text-xl font-medium text-econotrip-blue mb-1">
            Olá, Maria! Que bom ter você de volta!
          </h1>
          <p className="text-sm text-gray-600">
            Descubra novas aventuras e aproveite ofertas especiais
          </p>
        </motion.div>

        <MotivationalHint message="Hoje é um ótimo dia para planejar sua próxima viagem dos sonhos!" />

        {/* Resumo do Programa de Fidelidade */}
        <motion.div variants={itemAnimation}>
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4 text-econotrip-green" />
            <h2 className="text-base font-medium text-econotrip-blue">
              Seu Programa Milhas Sênior
            </h2>
            <ContextualTooltip content="Com cada viagem você ganha pontos que podem ser trocados por descontos em passagens futuras. Quanto mais você viaja, mais benefícios recebe!" />
          </div>
          <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 border-l-4 border-l-econotrip-green rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-econotrip-green" />
                  <span className="text-2xl font-bold text-econotrip-green">{pontosAtuais}</span>
                  <span className="text-sm text-gray-600">pontos</span>
                </div>
                <p className="text-xs text-gray-600">
                  Você está quase lá! Faltam apenas {metaProximoNivel - pontosAtuais} pontos para o próximo nível
                </p>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pontosDistribuicao}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
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
              className="h-2 mb-3" 
            />
            
            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/fidelidade")}
                className="text-xs"
              >
                Ver todos os benefícios
              </Button>
              <div className="text-xs text-gray-600">
                Nível atual: Prata
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Gráfico de Evolução de Pontos */}
        <motion.div variants={itemAnimation}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-econotrip-blue" />
            <h2 className="text-base font-medium text-econotrip-blue">
              Como você está evoluindo
            </h2>
            <ContextualTooltip content="Este gráfico mostra como seus pontos aumentaram nos últimos meses. Continue viajando para acelerar sua evolução!" />
          </div>
          <Card className="p-4 rounded-2xl">
            <div className="h-32 w-full">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicoPontos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="pontos" 
                      stroke="#A1C181" 
                      strokeWidth={3}
                      dot={{ fill: "#A1C181", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Parabéns! Você ganhou +30 pontos este mês
            </p>
          </Card>
        </motion.div>

        {/* Próximas viagens */}
        {proximasViagens.length > 0 && (
          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-econotrip-blue" />
              <h2 className="text-base font-medium text-econotrip-blue">
                Sua próxima aventura
              </h2>
            </div>
            <Card className="p-4 bg-gradient-to-r from-econotrip-blue/5 to-econotrip-orange/5 border-l-4 border-l-econotrip-orange rounded-2xl">
              {proximasViagens.map((viagem, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-econotrip-blue text-sm">{viagem.destino}</h3>
                    <p className="text-xs text-gray-600">Partida em {viagem.data}</p>
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
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </motion.div>
        )}

        {/* Ações rápidas melhoradas */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-base font-medium text-econotrip-blue mb-4 flex items-center gap-2">
            <Star className="h-4 w-4" />
            O que você gostaria de fazer hoje?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/busca-voos")}
              className="cursor-pointer"
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-200 group border-econotrip-orange/20 hover:border-econotrip-orange/40 rounded-2xl">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-econotrip-orange/10 rounded-xl group-hover:bg-econotrip-orange/20 transition-colors">
                    <Search className="h-6 w-6 text-econotrip-orange" />
                  </div>
                  <div>
                    <h3 className="font-medium text-econotrip-blue text-sm">Buscar passagens</h3>
                    <p className="text-xs text-gray-600">Encontre ofertas incríveis</p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/meu-roteiro")}
              className="cursor-pointer"
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-200 group border-econotrip-blue/20 hover:border-econotrip-blue/40 rounded-2xl">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 bg-econotrip-blue/10 rounded-xl group-hover:bg-econotrip-blue/20 transition-colors">
                    <Route className="h-6 w-6 text-econotrip-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium text-econotrip-blue text-sm">Planejar roteiro</h3>
                    <p className="text-xs text-gray-600">Organize sua viagem</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Ofertas especiais */}
        <motion.div variants={itemAnimation}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium text-econotrip-blue flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ofertas selecionadas para você
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
                <Card className={`p-4 bg-gradient-to-r ${pacote.cor} text-white shadow-lg border-0 rounded-2xl`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{pacote.destino}</h3>
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                          {pacote.desconto}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mb-2">Viagem {pacote.tipo}</p>
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
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resumo de Economia */}
        <motion.div variants={itemAnimation}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-medium text-econotrip-blue flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Suas conquistas
            </h2>
            <ContextualTooltip content="Veja quanto você já economizou com o EconoTrip e quantas viagens realizou." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-gradient-to-br from-econotrip-green/10 to-econotrip-green/5 rounded-2xl">
              <div className="text-center">
                <Award className="h-6 w-6 text-econotrip-green mx-auto mb-2" />
                <p className="text-lg font-bold text-econotrip-green">R$ 240</p>
                <p className="text-xs text-gray-600">Economia este ano</p>
              </div>
            </Card>
            <Card className="p-3 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 rounded-2xl">
              <div className="text-center">
                <Plane className="h-6 w-6 text-econotrip-blue mx-auto mb-2" />
                <p className="text-lg font-bold text-econotrip-blue">3</p>
                <p className="text-xs text-gray-600">Viagens realizadas</p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Dicas */}
        <motion.div variants={itemAnimation}>
          <h2 className="text-base font-medium text-econotrip-blue mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dicas especiais para você
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <Card className="p-3 hover:shadow-md transition-shadow rounded-2xl">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-econotrip-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Melhor época para economizar</h4>
                  <p className="text-xs text-gray-600">
                    Viagens entre janeiro e março oferecem os melhores preços
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-3 hover:shadow-md transition-shadow rounded-2xl">
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-econotrip-blue mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Viaje com amigos</h4>
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
  );
}
