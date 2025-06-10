
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award, Plane, MapPin, Coins, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function MinhaEvolucaoScreen() {
  const navigate = useNavigate();

  const pontuacaoAtual = 180;
  const metaProximoNivel = 300;
  const progressoPontos = (pontuacaoAtual / metaProximoNivel) * 100;

  const estatisticas = [
    { label: "Total de Voos", valor: "3", icone: Plane, cor: "text-econotrip-blue" },
    { label: "Destinos Visitados", valor: "2", icone: MapPin, cor: "text-econotrip-green" },
    { label: "Economia em Milhas", valor: "R$ 240", icone: Coins, cor: "text-econotrip-orange" }
  ];

  const dadosGrafico = [
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

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-4 space-y-6 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/dashboard")}
          className="flex-shrink-0"
          aria-label="Voltar ao dashboard"
        />
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-econotrip-orange" />
          <h1 className="text-xl font-semibold text-econotrip-blue">
            Minha Evolução
          </h1>
        </div>
      </motion.div>

      {/* Frase Motivacional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center py-4"
      >
        <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 border-l-4 border-l-econotrip-green rounded-2xl">
          <p className="text-base font-medium text-econotrip-blue">
            Você está cada vez mais perto do próximo destino!
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Continue explorando o mundo com a ECONOTRIP
          </p>
        </Card>
      </motion.div>

      {/* Pontuação no Programa Milhas Sênior */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-econotrip-green" />
          <h2 className="text-base font-semibold text-econotrip-blue">
            Programa Milhas Sênior
          </h2>
        </div>

        <Card className="p-4 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 rounded-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-econotrip-green" />
                  <span className="text-2xl font-bold text-econotrip-green">{pontuacaoAtual}</span>
                  <span className="text-sm text-gray-600">pontos</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Nível atual: Prata
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Para o próximo nível</p>
                <p className="text-sm font-semibold text-econotrip-green">
                  {metaProximoNivel - pontuacaoAtual} pontos
                </p>
              </div>
            </div>
            
            <Progress value={progressoPontos} className="h-3" />
            
            <p className="text-xs text-center text-gray-600">
              {Math.round(progressoPontos)}% concluído para o nível Ouro
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Gráfico de Evolução de Pontos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-base font-semibold text-econotrip-blue">
          Evolução dos Últimos Meses
        </h2>

        <Card className="p-4 rounded-2xl">
          <div className="h-40 w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="pontos" 
                    fill="#A1C181" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            +30 pontos ganhos este mês! 🎉
          </p>
        </Card>
      </motion.div>

      {/* Estatísticas de Viagens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-base font-semibold text-econotrip-blue">
          Suas Conquistas
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {estatisticas.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gray-50`}>
                    <stat.icone className={`h-6 w-6 ${stat.cor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.cor}`}>
                      {stat.valor}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Botão para ver benefícios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("/fidelidade")}
          className="w-full"
        >
          Ver Todos os Benefícios
        </Button>
      </motion.div>
    </div>
  );
}
