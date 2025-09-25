import React from "react";
import { motion } from "framer-motion";
import { Radar, Plus, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";

interface RadaresEmptyStateProps {
  onCreateRadar: () => void;
}

export function RadaresEmptyState({ onCreateRadar }: RadaresEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-1"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-0 mx-4">
        {/* Animated radar icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative">
            <Radar className="w-12 h-12 text-white" />
            
            {/* Animated pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-econotrip-blue/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-econotrip-orange/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Nenhum radar criado ainda
          </h3>
          
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Crie seu primeiro radar de ofertas e seja notificado quando encontrarmos voos incríveis para seus destinos favoritos!
          </p>
        </motion.div>
        
        {/* Benefits section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6 mb-6"
        >
          <h4 className="font-semibold text-econotrip-blue mb-4 flex items-center justify-center gap-2">
            <Bell className="h-5 w-5" />
            Como funciona o Radar de Ofertas:
          </h4>
          
          <div className="space-y-3 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-econotrip-blue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-econotrip-blue font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Defina seu destino</p>
                <p className="text-sm text-gray-600">Escolha de onde e para onde quer viajar</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-econotrip-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-econotrip-orange font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Monitore automaticamente</p>
                <p className="text-sm text-gray-600">Nosso sistema busca as melhores ofertas para você</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Receba notificações</p>
                <p className="text-sm text-gray-600">Te avisamos quando encontramos promoções imperdíveis</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Button
            onClick={onCreateRadar}
            icon={Plus}
            iconPosition="left"
            className="w-full h-14 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 touch-target"
          >
            Criar Radar
          </Button>
          
          <p className="text-xs text-gray-500 mt-3">
            É grátis e você pode criar quantos radares quiser!
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
