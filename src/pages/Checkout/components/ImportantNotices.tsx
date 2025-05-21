
import React from "react";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { Info, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ImportantNotices() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 mb-8"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <AlertBox 
                type="info" 
                icon={Info}
                title="Política de cancelamento"
              >
                O cancelamento é gratuito até 48h antes da partida.
              </AlertBox>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-sm font-medium">Clique para mais detalhes sobre cancelamentos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <AlertBox 
          type="success" 
          icon={CheckCircle}
          title="Programa de fidelidade"
        >
          Você acumulou 30 pontos no programa Milhas Sênior!
        </AlertBox>
      </motion.div>
    </motion.div>
  );
}
