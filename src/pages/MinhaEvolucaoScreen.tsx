import React, { useState } from "react";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Award, 
  Coins, 
  Target,
  Star,
  Trophy,
  Calendar,
  BarChart3,
  Globe,
  Plane
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function MinhaEvolucaoScreen() {
  const [activeTab, setActiveTab] = useState<"pontos" | "conquistas" | "estatisticas">("pontos");

  // Dados para gráficos
  const pontosHistorico = [
    { mes: "Set", pontos: 50 },
    { mes: "Out", pontos: 80 },
    { mes: "Nov", pontos: 120 },
    { mes: "Dez", pontos: 160 },
    { mes: "Jan", pontos: 180 },
  ];

  const viagensAno = [
    { mes: "Jan", viagens: 0 },
    { mes: "Mar", viagens: 1 },
    { mes: "Jun", viagens: 1 },
    { mes: "Set", viagens: 1 },
    { mes: "Dez", viagens: 1 },
  ];

  const economiaDistribuicao = [
    { name: "Voos", value: 240, fill: "#3B82F6" },
    { name: "Hospedagem", value: 150, fill: "#F59E0B" },
    { name: "Outros", value: 80, fill: "#10B981" }
  ];

  const conquistas = [
    { id: 1, titulo: "Primeira Viagem", descricao: "Completou sua primeira viagem", icone: Plane, conquistado: true, data: "Mar 2023" },
    { id: 2, titulo: "Explorador", descricao: "Visitou 3 países diferentes", icone: Globe, conquistado: true, data: "Set 2023" },
    { id: 3, titulo: "Econômico", descricao: "Economizou R$ 200 em viagens", icone: Coins, conquistado: true, data: "Dez 2023" },
    { id: 4, titulo: "Viajante Frequente", descricao: "Realizou 5 viagens", icone: Star, conquistado: false, progresso: 80 },
    { id: 5, titulo: "Sustentável", descricao: "Escolheu 3 voos sustentáveis", icone: Globe, conquistado: false, progresso: 33 },
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
              <TrendingUp className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
              Minha Evolução
            </h1>
            <p className="text-lg text-gray-600 text-balance">
              Acompanhe seu progresso e conquistas
            </p>
          </motion.div>

          {/* Resumo geral */}
          <motion.div variants={itemAnimation}>
            <Card className="p-6 bg-gradient-to-r from-econotrip-blue/10 to-econotrip-orange/10 rounded-3xl shadow-lg border-0">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-econotrip-blue">180</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-econotrip-orange">3</div>
                  <div className="text-sm text-gray-600">Conquistas</div>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-econotrip-green to-econotrip-green/80 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-econotrip-green">Prata</div>
                  <div className="text-sm text-gray-600">Nível</div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tabs modernos */}
          <motion.div variants={itemAnimation}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("pontos")}
                  className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "pontos"
                      ? "bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 text-white shadow-lg"
                      : "text-gray-600 hover:text-econotrip-blue"
                  }`}
                >
                  Pontos
                </button>
                <button
                  onClick={() => setActiveTab("conquistas")}
                  className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "conquistas"
                      ? "bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 text-white shadow-lg"
                      : "text-gray-600 hover:text-econotrip-blue"
                  }`}
                >
                  Conquistas
                </button>
                <button
                  onClick={() => setActiveTab("estatisticas")}
                  className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "estatisticas"
                      ? "bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 text-white shadow-lg"
                      : "text-gray-600 hover:text-econotrip-blue"
                  }`}
                >
                  Estatísticas
                </button>
              </div>
            </div>
          </motion.div>

          {activeTab === "pontos" && (
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Progresso do nível */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-econotrip-blue" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Progresso para Próximo Nível
                  </h2>
                </div>
                <Card className="p-6 bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 rounded-3xl shadow-lg border-l-4 border-l-econotrip-green">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-econotrip-green text-xl">Nível Prata</h3>
                      <p className="text-gray-600">180 / 300 pontos</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-econotrip-green">60%</div>
                      <p className="text-sm text-gray-600">Completo</p>
                    </div>
                  </div>
                  <Progress value={60} className="h-3 mb-4 bg-gray-200 rounded-full" />
                  <p className="text-sm text-gray-600">
                    Faltam apenas 120 pontos para alcançar o nível Ouro!
                  </p>
                </Card>
              </motion.div>

              {/* Gráfico de evolução de pontos */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-econotrip-blue" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Evolução de Pontos
                  </h2>
                </div>
                <Card className="rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm border-0 overflow-hidden relative h-64">
                  <div className="absolute inset-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pontosHistorico} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="mes" 
                          stroke="#666" 
                          fontSize={12} 
                          axisLine={false}
                          tickLine={false}
                          tick={{ dy: 5 }}
                        />
                        <YAxis 
                          stroke="#666" 
                          fontSize={12} 
                          axisLine={false}
                          tickLine={false}
                          tick={{ dx: -5 }}
                          width={35}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pontos" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Como ganhar mais pontos */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-econotrip-orange" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Como Ganhar Mais Pontos
                  </h2>
                </div>
                <div className="space-y-3">
                  <Card className="p-4 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80 rounded-xl flex items-center justify-center">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-econotrip-blue">Reserve uma viagem</h4>
                          <p className="text-sm text-gray-600">Ganhe até 50 pontos</p>
                        </div>
                      </div>
                      <Badge className="bg-econotrip-blue/10 text-econotrip-blue border-econotrip-blue/20 rounded-full">
                        +50
                      </Badge>
                    </div>
                  </Card>
                  <Card className="p-4 rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80 rounded-xl flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-econotrip-blue">Avalie sua viagem</h4>
                          <p className="text-sm text-gray-600">Ganhe 20 pontos</p>
                        </div>
                      </div>
                      <Badge className="bg-econotrip-orange/10 text-econotrip-orange border-econotrip-orange/20 rounded-full">
                        +20
                      </Badge>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "conquistas" && (
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-econotrip-orange" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Suas Conquistas
                  </h2>
                </div>
                <div className="space-y-3">
                  {conquistas.map((conquista) => (
                    <Card key={conquista.id} className={`p-4 rounded-3xl shadow-lg border-0 ${
                      conquista.conquistado 
                        ? "bg-gradient-to-r from-econotrip-green/10 to-econotrip-green/5 border-l-4 border-l-econotrip-green" 
                        : "bg-white/95 backdrop-blur-sm"
                    }`}>
                      <div className="flex items-start justify-between min-h-[4rem]">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                            conquista.conquistado 
                              ? "bg-gradient-to-r from-econotrip-green to-econotrip-green/80" 
                              : "bg-gradient-to-r from-gray-400 to-gray-500"
                          }`}>
                            <conquista.icone className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-base leading-tight ${
                              conquista.conquistado ? "text-econotrip-green" : "text-gray-600"
                            }`}>
                              {conquista.titulo}
                            </h3>
                            <p className="text-sm text-gray-600 leading-tight mt-1">{conquista.descricao}</p>
                            {conquista.conquistado && conquista.data && (
                              <p className="text-xs text-gray-500 mt-1">Conquistado em {conquista.data}</p>
                            )}
                          </div>
                        </div>
                        <div className="ml-3 flex-shrink-0 self-start">
                          {!conquista.conquistado && (
                            <div className="text-right">
                              <div className="text-xs font-medium text-gray-600 mb-1">{conquista.progresso}%</div>
                              <Progress value={conquista.progresso} className="w-16 h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "estatisticas" && (
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Viagens por mês */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-econotrip-blue" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Viagens por Mês
                  </h2>
                </div>
                <Card className="rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm border-0 overflow-hidden relative h-64">
                  <div className="absolute inset-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={viagensAno} margin={{ top: 30, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="mes" 
                          stroke="#666" 
                          fontSize={12} 
                          axisLine={false}
                          tickLine={false}
                          tick={{ dy: 5 }}
                        />
                        <YAxis 
                          stroke="#666" 
                          fontSize={12} 
                          axisLine={false}
                          tickLine={false}
                          tick={{ dx: -5 }}
                          width={35}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'
                          }}
                        />
                        <Bar dataKey="viagens" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Distribuição de economia */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="h-5 w-5 text-econotrip-green" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Economia por Categoria
                  </h2>
                </div>
                <Card className="p-6 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm border-0">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={economiaDistribuicao}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={50}
                            dataKey="value"
                          >
                            {economiaDistribuicao.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {economiaDistribuicao.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }}></div>
                          <span className="text-sm text-gray-600">{item.name}: R$ {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Estatísticas gerais */}
              <motion.div variants={itemAnimation}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-econotrip-orange" />
                  <h2 className="text-lg font-semibold text-econotrip-blue">
                    Resumo Geral
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-econotrip-blue/10 to-econotrip-blue/5 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-econotrip-blue">470</div>
                      <div className="text-sm text-gray-600">Total de Pontos Ganhos</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-econotrip-orange/10 to-econotrip-orange/5 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-econotrip-orange">28</div>
                      <div className="text-sm text-gray-600">Dias Viajando</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-econotrip-green/10 to-econotrip-green/5 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-econotrip-green">4</div>
                      <div className="text-sm text-gray-600">Países Visitados</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">4.7</div>
                      <div className="text-sm text-gray-600">Avaliação Média</div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
