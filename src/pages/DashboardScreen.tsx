
import React, { useState, useEffect } from "react";
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
  Globe,
  Wallet,
  Shield,
  Sun,
  Camera,
  Coffee,
  Mountain,
  Landmark,
  Train,
  Car,
  Backpack,
  Hotel,
  MessageSquare
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

// Array de dicas especiais
const dicasEspeciais = [
  {
    id: 1,
    titulo: "Melhor época para economizar",
    descricao: "Viagens entre janeiro e março oferecem os melhores preços",
    icone: Clock,
    cor: "econotrip-blue"
  },
  {
    id: 2,
    titulo: "Viaje com amigos",
    descricao: "Grupos de 4 ou mais pessoas ganham descontos especiais",
    icone: Users,
    cor: "econotrip-orange"
  },
  {
    id: 3,
    titulo: "Reserve com antecedência",
    descricao: "Passagens compradas com 6 meses de antecedência são até 40% mais baratas",
    icone: Calendar,
    cor: "econotrip-green"
  },
  {
    id: 4,
    titulo: "Voos noturnos custam menos",
    descricao: "Voos entre 23h e 6h têm preços mais acessíveis",
    icone: Clock,
    cor: "econotrip-blue"
  },
  {
    id: 5,
    titulo: "Destinos alternativos",
    descricao: "Aeroportos próximos podem ter passagens até 30% mais baratas",
    icone: MapPin,
    cor: "econotrip-orange"
  },
  {
    id: 6,
    titulo: "Terças e quartas são ideais",
    descricao: "Viajar no meio da semana oferece os melhores preços",
    icone: Calendar,
    cor: "econotrip-green"
  },
  {
    id: 7,
    titulo: "Programa de milhas",
    descricao: "Use suas milhas para upgrades ou passagens gratuitas",
    icone: Gift,
    cor: "econotrip-blue"
  },
  {
    id: 8,
    titulo: "Bagagem inteligente",
    descricao: "Viaje só com bagagem de mão e economize nas taxas",
    icone: Backpack,
    cor: "econotrip-orange"
  },
  {
    id: 9,
    titulo: "Conexões estratégicas",
    descricao: "Voos com conexão podem ser mais baratos que diretos",
    icone: Route,
    cor: "econotrip-green"
  },
  {
    id: 10,
    titulo: "Temporada baixa",
    descricao: "Evite feriados e férias escolares para melhores preços",
    icone: TrendingUp,
    cor: "econotrip-blue"
  },
  {
    id: 11,
    titulo: "Seguro viagem",
    descricao: "Sempre contrate seguro viagem para ter tranquilidade",
    icone: Shield,
    cor: "econotrip-orange"
  },
  {
    id: 12,
    titulo: "Documentos em dia",
    descricao: "Verifique validade do passaporte com 6 meses de antecedência",
    icone: Landmark,
    cor: "econotrip-green"
  },
];

export default function DashboardScreen() {
  const navigate = useNavigate();

  const { user } = useAuthStore();

  // Estado para a dica selecionada
  const [dicaSelecionada, setDicaSelecionada] = useState(dicasEspeciais[0]);

  // Selecionar uma dica aleatória quando o componente carregar
  useEffect(() => {
    const dicaAleatoria = dicasEspeciais[Math.floor(Math.random() * dicasEspeciais.length)];
    setDicaSelecionada(dicaAleatoria);
  }, []);

  // Função para obter as classes de cor baseada na cor da dica
  const getColorClasses = (cor: string) => {
    const colorMap: { [key: string]: string } = {
      'econotrip-blue': 'bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80',
      'econotrip-orange': 'bg-gradient-to-r from-econotrip-orange to-econotrip-orange/80',
      'econotrip-green': 'bg-gradient-to-r from-econotrip-green to-econotrip-green/80'
    };
    return colorMap[cor] || 'bg-gradient-to-r from-econotrip-blue to-econotrip-blue/80';
  };

  // Dados do programa de fidelidade
  const pontosAtuais = 180;
  const metaProximoNivel = 300;
  const progressoPontos = (pontosAtuais / metaProximoNivel) * 100;

  // Dados para gráfico de distribuição de pontos
  const pontosDistribuicao = [
    { name: "Pontos Atuais", value: pontosAtuais, fill: "#153D6B" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              className="w-16 h-16 bg-econotrip-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
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
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 bg-econotrip-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  {React.createElement(dicaSelecionada.icone, { className: "h-5 w-5 text-white" })}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-econotrip-primary text-sm">{dicaSelecionada.titulo}</h3>
                  <p className="text-xs text-gray-600">Para você hoje</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {dicaSelecionada.descricao}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const novaDica = dicasEspeciais[Math.floor(Math.random() * dicasEspeciais.length)];
                  setDicaSelecionada(novaDica);
                }}
                className="text-xs bg-white/80 text-gray-600 hover:bg-white border-gray-200 rounded-lg px-3 py-1"
              >
                💡 Ver outra dica
              </Button>
            </div>
          </motion.div>

          {/* Ações principais modernas */}
          <motion.div variants={itemAnimation}>
            <h2 className="text-base font-semibold text-econotrip-primary mb-3 flex items-center gap-2">
              <Plane className="h-4 w-4" />
              O que você quer fazer hoje?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className="p-4 bg-white border-l-4 border-l-econotrip-primary rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/busca-voos")}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-econotrip-primary rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-econotrip-primary mb-1 text-sm">Buscar Voos</h3>
                  <p className="text-xs text-gray-600">Encontre as melhores passagens</p>
                </div>
              </Card>

              <Card
                className="p-4 bg-white border-l-4 border-l-econotrip-coral rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/meu-roteiro")}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-econotrip-coral rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Route className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-econotrip-primary mb-1 text-sm">Simulador</h3>
                  <p className="text-xs text-gray-600">Simule sua próxima viagem</p>
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
            <div className="grid grid-cols-2 gap-3">
              <Card
                className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/ofertas-continentes")}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-econotrip-blue-light rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-primary text-xs mb-1">Ofertas por Continentes</h4>
                  <p className="text-xs text-gray-600">Encontre o mais parecido com você</p>
                </div>
              </Card>

              <Card
                className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/meus-radares")}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-econotrip-blue-light rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-primary text-xs mb-1">Radar de Voos</h4>
                  <p className="text-xs text-gray-600">Não perca promoções</p>
                </div>
              </Card>

              <Card
                className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/busca-hospedagem")}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-econotrip-coral rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Hotel className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-primary text-xs mb-1">Hospedagem</h4>
                  <p className="text-xs text-gray-600">Encontre hotéis e pousadas</p>
                </div>
              </Card>

              <Card
                className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate("/feedback")}
              >
                <div className="text-center">
                  <div className="w-10 h-10 bg-econotrip-green rounded-lg flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-econotrip-primary text-xs mb-1">Feedback</h4>
                  <p className="text-xs text-gray-600">Ajude-nos a melhorar</p>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Programa de fidelidade moderno */}
          {/* <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-4 w-4 text-econotrip-primary" />
              <h2 className="text-base font-semibold text-econotrip-primary">
                Programa Milhas Sênior
              </h2>
              <ContextualTooltip content="Com cada viagem você ganha pontos que podem ser trocados por descontos em passagens futuras!" />
            </div>
            <Card className="p-4 bg-white border-l-4 border-l-econotrip-primary rounded-2xl shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-econotrip-primary rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-2xl font-bold text-econotrip-primary">{pontosAtuais}</span>
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
                  className="bg-white/80 text-econotrip-primary border-econotrip-primary/20 rounded-xl hover:bg-white text-sm w-full sm:w-auto"
                >
                  Ver evolução completa
                </Button>
                <div className="text-sm text-gray-600 font-medium">
                  Nível atual: <span className="text-econotrip-primary">Prata</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemAnimation}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-base font-semibold text-econotrip-primary flex items-center gap-2">
                <Award className="h-4 w-4" />
                Suas conquistas
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-econotrip-green rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xl font-bold text-econotrip-primary">R$ 240</p>
                  <p className="text-xs text-gray-600">Economia este ano</p>
                </div>
              </Card>
              <Card className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-econotrip-green rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-xl font-bold text-econotrip-primary">3</p>
                  <p className="text-xs text-gray-600">Viagens realizadas</p>
                </div>
              </Card>
            </div>
          </motion.div>*/}
        </motion.div> 
      </div>
    </div>
  );
}
