
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCircle, 
  Edit2, 
  Medal, 
  Calendar, 
  Plane, 
  MapPin, 
  HelpCircle, 
  CheckCircle 
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DetailItem } from "@/pages/FlightDetails/components/DetailItem";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export default function ProfileScreen() {
  const navigate = useNavigate();

  const handleViewLoyalty = () => {
    navigate("/fidelidade");
    toast({
      title: "Navegando para Programa de Fidelidade",
      description: "Veja seus pontos e vantagens",
    });
  };

  const handleEditProfile = () => {
    navigate("/editar-perfil");
    toast({
      title: "Editando perfil",
      description: "Você pode alterar seus dados pessoais",
    });
  };

  const handleViewTripDetails = () => {
    toast({
      title: "Detalhes da viagem",
      description: "Em um aplicativo real, isto mostraria os detalhes da sua viagem",
    });
  };

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto py-4 px-3 md:py-6 md:px-4 pb-20 md:pb-24"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
    >
      {/* Header Section with Avatar */}
      <motion.div 
        className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6 md:mb-8"
        variants={itemAnimation}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 text-center sm:text-left">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-econotrip-orange/20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Maria Oliveira" />
            <AvatarFallback className="bg-econotrip-orange/20">
              <UserCircle className="h-8 w-8 md:h-10 md:w-10 text-econotrip-orange" />
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
            Meu Perfil
          </h1>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleEditProfile} 
            icon={Edit2}
            className="touch-target w-full sm:w-auto"
            aria-label="Editar perfil"
          >
            Editar
          </Button>
        </motion.div>
      </motion.div>

      {/* Personal Information Section */}
      <motion.div variants={itemAnimation}>
        <Card className="mb-6 md:mb-8 p-4 md:p-6 rounded-2xl shadow-md">
          <h2 className="text-lg md:text-xl xl:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
            Dados Pessoais
          </h2>
          
          <div className="space-y-3 md:space-y-4 text-base md:text-lg">
            <DetailItem 
              icon={UserCircle} 
              title="Nome Completo" 
              value="Maria Oliveira" 
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-econotrip-blue flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 5L2 11l19 5.5L21 5zm-9 14v-7.5" />
                </svg>
                <div className="min-w-0">
                  <p className="font-medium text-econotrip-blue text-sm md:text-base">E-mail</p>
                  <p className="text-gray-700 text-sm md:text-base break-all">maria@exemplo.com</p>
                </div>
              </div>
            </div>
            
            <DetailItem 
              icon={Calendar} 
              title="Data de Nascimento" 
              value="12/05/1958" 
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-econotrip-blue flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <div className="min-w-0">
                  <p className="font-medium text-econotrip-blue text-sm md:text-base">CPF</p>
                  <p className="text-gray-700 text-sm md:text-base">123.456.789-00</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Loyalty Program Section */}
      <motion.div variants={itemAnimation}>
        <motion.div
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="mb-6 md:mb-8"
        >
          <Card className="p-4 md:p-6 rounded-2xl shadow-md border-econotrip-green bg-econotrip-green/5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
              <h2 className="text-lg md:text-xl xl:text-2xl font-museomoderno font-bold text-econotrip-blue">
                Programa Milhas Sênior
              </h2>
              <Medal className="h-6 w-6 md:h-8 md:w-8 text-econotrip-green flex-shrink-0" />
            </div>
            
            <div className="mb-4 md:mb-6">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-lg md:text-xl font-bold text-econotrip-green">180</p>
                <p className="text-base md:text-lg text-econotrip-blue">pontos acumulados</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5">
                <div className="bg-econotrip-green h-2 md:h-2.5 rounded-full transition-all duration-300" style={{ width: '36%' }}></div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-2">500 pontos para o próximo nível</p>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="secondary" 
                onClick={handleViewLoyalty} 
                icon={Medal}
                className="w-full justify-center"
              >
                Ver detalhes do programa
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Travel History Section */}
      <motion.div variants={itemAnimation} className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg md:text-xl xl:text-2xl font-museomoderno font-bold text-econotrip-blue">
            Minhas Viagens
          </h2>
          <Plane className="h-5 w-5 md:h-6 md:w-6 text-econotrip-blue" />
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {/* First Trip Card */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-4 md:p-5 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-econotrip-orange flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-econotrip-blue">Lisboa, Portugal</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                      <span className="text-sm md:text-base">10/03/2024</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1 bg-econotrip-green/10 text-econotrip-green px-2 py-1 rounded-full w-fit">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm font-medium">Concluído</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={handleViewTripDetails}
                      className="w-full sm:w-auto"
                    >
                      Ver detalhes
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Second Trip Card */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-4 md:p-5 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-econotrip-orange flex-shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-econotrip-blue">Foz do Iguaçu, Brasil</h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                      <span className="text-sm md:text-base">18/11/2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-1 bg-econotrip-green/10 text-econotrip-green px-2 py-1 rounded-full w-fit">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm font-medium">Concluído</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={handleViewTripDetails}
                      className="w-full sm:w-auto"
                    >
                      Ver detalhes
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Help Button */}
      <div className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors touch-target"
                aria-label="Precisa de ajuda com seu perfil?"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HelpCircle className="h-6 w-6 md:h-7 md:w-7" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Precisa de ajuda com seu perfil?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
