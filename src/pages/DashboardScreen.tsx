
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
import { ActionButtons } from "@/components/dashboard/ActionButtons";
import { LastTrip } from "@/components/dashboard/LastTrip";
import { ExploreCategories } from "@/components/dashboard/ExploreCategories";

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

        {/* Seção principal de ações */}
        <motion.div variants={itemAnimation}>
          <ActionButtons />
        </motion.div>

        {/* Última viagem */}
        <motion.div variants={itemAnimation}>
          <LastTrip />
        </motion.div>

        {/* Categorias para explorar */}
        <motion.div variants={itemAnimation}>
          <ExploreCategories />
        </motion.div>

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
                onClick={() => navigate("/minha-evolucao")}
                className="text-xs"
              >
                Ver evolução completa
              </Button>
              <div className="text-xs text-gray-600">
                Nível atual: Prata
              </div>
            </div>
          </Card>
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
