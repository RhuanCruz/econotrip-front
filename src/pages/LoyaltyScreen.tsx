import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { Progress } from "@/components/ui/progress";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Star, Award, ArrowLeft, Plane, Leaf, Megaphone, HelpCircle, ChevronLeft, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

export default function LoyaltyScreen() {
  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate("/perfil");
  };

  const currentPoints = 180;
  const targetPoints = 300;
  const remainingPoints = targetPoints - currentPoints;
  const progressPercentage = (currentPoints / targetPoints) * 100;
  
  // Data for the circular progress chart
  const pieData = [
    { name: "Pontos Atuais", value: currentPoints },
    { name: "Pontos Restantes", value: remainingPoints }
  ];
  const COLORS = ["#A1C181", "#E5E5E5"];
  
  // Data for bar chart
  const pointsSourceData = [
    { name: "Viagens", pontos: 100, fill: "#0D3B66" },
    { name: "Check-ins", pontos: 50, fill: "#FF8C42" },
    { name: "Indicações", pontos: 30, fill: "#A1C181" }
  ];

  return (
    <LayoutBase userName="Maria">
      <div className="max-w-4xl mx-auto py-6 pb-24 px-4 relative">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <Star className="h-8 w-8 text-yellow-500" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
            Programa Milhas Sênior
          </h1>
        </motion.div>

        {/* Current Points Section with Circular Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="mb-8 p-6 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <div className="flex justify-center md:justify-start items-center mb-4">
                  <Medal className="h-8 w-8 text-econotrip-green mr-2" aria-hidden="true" />
                  <p className="text-2xl md:text-3xl font-bold text-econotrip-green">
                    {currentPoints} pontos
                  </p>
                </div>

                <div className="mb-6 w-full md:max-w-xs">
                  <Progress 
                    value={progressPercentage} 
                    className="h-4 rounded-full bg-gray-200"
                    aria-label={`Progresso: ${progressPercentage.toFixed(0)}% do caminho para o próximo nível`}
                  />
                  <p className="text-lg text-econotrip-blue mt-3">
                    Faltam <span className="font-bold">{remainingPoints} pontos</span> para o próximo nível!
                  </p>
                </div>
              </div>
              
              {/* Circular Progress Chart */}
              <div className="w-48 h-48 mx-auto md:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={0}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name) => [`${value} pontos`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Points Source Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Como você acumulou pontos
          </h2>
          <Card className="p-4 rounded-2xl shadow-md">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pointsSourceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <RechartsTooltip 
                    formatter={(value, name) => [`${value} pontos`, ""]} 
                    labelStyle={{ fontSize: 14 }}
                    contentStyle={{ fontSize: 16 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 14 }} />
                  <Bar dataKey="pontos" name="Pontos acumulados" radius={[8, 8, 0, 0]}>
                    {pointsSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Unlocked Rewards Section */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Recompensas Desbloqueadas
          </h2>
          
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 rounded-2xl shadow-md border-econotrip-green bg-econotrip-green/10">
                <div className="flex items-center gap-3">
                  <Award className="h-10 w-10 text-econotrip-green flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Desconto de 10% na próxima viagem</h3>
                    <p className="text-gray-600">Desbloqueado ao atingir 100 pontos</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 rounded-2xl shadow-md border-econotrip-green bg-econotrip-green/10">
                <div className="flex items-center gap-3">
                  <Award className="h-10 w-10 text-econotrip-green flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Prioridade no embarque</h3>
                    <p className="text-gray-600">Desbloqueado ao atingir 150 pontos</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* How to Earn Points Section */}
        <div className="mb-10">
          <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Como acumular mais pontos
          </h2>
          
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 rounded-2xl shadow-md">
                <div className="flex items-center gap-3">
                  <Plane className="h-8 w-8 text-econotrip-blue flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Viaje em dias úteis</h3>
                    <p className="text-gray-600">+30 pontos</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 rounded-2xl shadow-md">
                <div className="flex items-center gap-3">
                  <Leaf className="h-8 w-8 text-econotrip-green flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Escolha destinos sustentáveis</h3>
                    <p className="text-gray-600">+40 pontos</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-4 rounded-2xl shadow-md">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-8 w-8 text-econotrip-orange flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-lg font-bold text-econotrip-blue">Compartilhe sua experiência</h3>
                    <p className="text-gray-600">+50 pontos</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Info Alert */}
        <AlertBox 
          type="info" 
          icon={Megaphone}
          className="mb-12"
          title="Próxima meta: 300 pontos"
        >
          <p>Ao atingir 300 pontos você ganhará uma mala de mão grátis em todos os voos!</p>
        </AlertBox>

        {/* Back to Profile Button - Fixed at Bottom */}
        <motion.div 
          className="fixed bottom-6 left-0 right-0 flex justify-center z-10 mb-16"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={ChevronLeft}
            iconPosition="left"
            onClick={handleBackToProfile}
            className="bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-full h-16 shadow-lg px-10"
          >
            Voltar para Meu Perfil
          </Button>
        </motion.div>

        {/* Floating Help Button */}
        <div className="fixed bottom-20 right-6 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                  aria-label="Ajuda sobre o programa"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HelpCircle className="h-7 w-7" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Ajuda sobre o programa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </LayoutBase>
  );
}
