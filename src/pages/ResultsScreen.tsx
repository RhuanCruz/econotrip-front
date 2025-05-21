
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Leaf, Accessibility, Clock, DollarSign, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const mockFlights = [
  {
    id: "flight-1",
    origin: "São Paulo",
    originCode: "GRU",
    destination: "Lisboa",
    destinationCode: "LIS",
    date: "10/03/2024",
    price: 2350.0,
    duration: 620, // in minutes
    emissions: 83, // CO2 in kg
    isLowEmission: true,
    isAccessible: false,
    isBestValue: false,
  },
  {
    id: "flight-2",
    origin: "Rio de Janeiro",
    originCode: "GIG",
    destination: "Madrid",
    destinationCode: "MAD",
    date: "12/03/2024",
    price: 2800.0,
    duration: 685, // in minutes
    emissions: 98, // CO2 in kg
    isLowEmission: false,
    isAccessible: true,
    isBestValue: false,
  },
  {
    id: "flight-3",
    origin: "Curitiba",
    originCode: "CWB",
    destination: "Santiago",
    destinationCode: "SCL",
    date: "15/03/2024",
    price: 1980.0,
    duration: 550, // in minutes
    emissions: 75, // CO2 in kg
    isLowEmission: false,
    isAccessible: false,
    isBestValue: true,
  },
];

export default function ResultsScreen() {
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);

  const handleViewDetails = (flightId: string) => {
    // Navigate to the details page with the flight id
    navigate(`/detalhes-voo`, { state: { flightId } });
    
    // Show toast notification
    toast({
      title: "Voo selecionado",
      description: "Redirecionando para os detalhes do voo.",
    });
  };

  const handleNewSearch = () => {
    navigate("/busca-voos");
  };
  
  const handleToggleComparison = () => {
    setShowComparison(!showComparison);
  };
  
  // Format minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };
  
  // Prepare data for comparison chart
  const prepareComparisonData = () => {
    // Price comparison
    const priceData = mockFlights.map(flight => ({
      name: flight.originCode + " → " + flight.destinationCode,
      value: flight.price,
      fill: flight.id === "flight-3" ? "#A1C181" : "#0D3B66" // Green for best value
    }));
    
    // Duration comparison
    const durationData = mockFlights.map(flight => ({
      name: flight.originCode + " → " + flight.destinationCode,
      value: flight.duration,
      fill: "#FF8C42"
    }));
    
    // Emissions comparison
    const emissionsData = mockFlights.map(flight => ({
      name: flight.originCode + " → " + flight.destinationCode,
      value: flight.emissions,
      fill: flight.isLowEmission ? "#A1C181" : "#FF8C42" // Green for low emission
    }));
    
    return {
      priceData,
      durationData,
      emissionsData
    };
  };
  
  const { priceData, durationData, emissionsData } = prepareComparisonData();

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-museomoderno font-bold text-econotrip-blue">
              Voos encontrados
            </h1>
            
            <div className="mt-4 md:mt-0 flex gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={handleToggleComparison}
                      icon={BarChart2}
                    >
                      {showComparison ? "Ocultar comparação" : "Comparar voos"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compare preços, tempo de voo e emissões</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </motion.div>
        
        {/* Flight Comparison Charts */}
        {showComparison && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 mb-6 border-econotrip-blue">
              <h2 className="text-xl font-bold text-econotrip-blue mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Comparação de preços
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={priceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis 
                      tick={{ fontSize: 14 }} 
                      tickFormatter={(value) => `R$${value}`} 
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`R$ ${value}`, "Preço"]} 
                      labelStyle={{ fontSize: 14 }}
                      contentStyle={{ fontSize: 16 }}
                    />
                    <Bar dataKey="value" name="Preço (R$)" radius={[8, 8, 0, 0]}>
                      {priceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4 mb-6 border-econotrip-orange">
              <h2 className="text-xl font-bold text-econotrip-blue mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Duração do voo
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={durationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis 
                      tick={{ fontSize: 14 }}
                      tickFormatter={(value) => `${Math.floor(value/60)}h${value%60}m`}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [formatDuration(value as number), "Duração"]}
                      labelStyle={{ fontSize: 14 }}
                      contentStyle={{ fontSize: 16 }}
                    />
                    <Bar dataKey="value" name="Duração" radius={[8, 8, 0, 0]}>
                      {durationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-4 mb-6 border-econotrip-green">
              <h2 className="text-xl font-bold text-econotrip-blue mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Emissão de carbono
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={emissionsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis 
                      tick={{ fontSize: 14 }}
                      tickFormatter={(value) => `${value}kg`}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [`${value} kg CO₂`, "Emissão"]}
                      labelStyle={{ fontSize: 14 }}
                      contentStyle={{ fontSize: 16 }}
                    />
                    <Bar dataKey="value" name="Emissão CO₂ (kg)" radius={[8, 8, 0, 0]}>
                      {emissionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {mockFlights.map((flight, index) => (
            <motion.div
              key={flight.id}
              variants={itemVariants}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-2xl font-medium text-econotrip-blue">
                          {flight.origin} ({flight.originCode})
                        </h3>
                        <span className="text-gray-500">→</span>
                        <h3 className="text-2xl font-medium text-econotrip-blue">
                          {flight.destination} ({flight.destinationCode})
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-2">Data: {flight.date}</p>
                      <p className="text-gray-600">Duração: {formatDuration(flight.duration)}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-gray-600 text-sm mb-1">Preço por pessoa</p>
                      <p className="text-2xl md:text-3xl font-bold text-econotrip-orange">
                        R$ {flight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {flight.isLowEmission && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center text-econotrip-green">
                              <Leaf className="h-5 w-5 mr-1" />
                              <span>Baixa emissão de carbono</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Este voo emite menos CO₂ que a média</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    {flight.isAccessible && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center text-econotrip-blue">
                              <Accessibility className="h-5 w-5 mr-1" />
                              <span>Acessível para passageiros com mobilidade reduzida</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Este voo oferece assistência especial</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    {flight.isBestValue && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center text-econotrip-orange">
                              <span className="font-semibold">✓ Melhor custo-benefício</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Melhor relação entre preço, duração e conforto</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleViewDetails(flight.id)}
                      >
                        Ver detalhes
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-8 flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="primary"
              size="lg"
              onClick={handleNewSearch}
              className="mb-16"
            >
              Nova busca
            </Button>
          </motion.div>
        </div>
      </div>
    </LayoutBase>
  );
}
