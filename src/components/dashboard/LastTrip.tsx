
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Calendar, Star, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export function LastTrip() {
  const navigate = useNavigate();

  // Mock data - em uma aplicação real viria de um contexto ou API
  const lastTrip = {
    destination: "Rio de Janeiro",
    date: "15 Janeiro 2025",
    wasRecent: true
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <h2 className="text-base font-medium text-econotrip-blue flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Última Viagem
      </h2>
      
      <Card className="p-4 bg-gradient-to-r from-econotrip-blue/10 to-econotrip-blue/5 border-l-4 border-l-econotrip-blue rounded-2xl">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-econotrip-blue text-base">
              {lastTrip.destination}
            </h3>
            <p className="text-sm text-gray-600">
              Viagem realizada em {lastTrip.date}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Star}
              onClick={() => navigate("/avaliacao")}
              className="flex-1 bg-econotrip-orange hover:bg-econotrip-orange/90"
            >
              Avaliar Viagem
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={() => navigate("/busca-voos")}
              className="flex-1"
            >
              Repetir Viagem
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
