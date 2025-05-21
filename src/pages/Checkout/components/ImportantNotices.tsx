
import React from "react";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { Info, CheckCircle } from "lucide-react";

export function ImportantNotices() {
  return (
    <div className="space-y-4 mb-8">
      <AlertBox 
        type="info" 
        icon={Info}
        title="Política de cancelamento"
      >
        O cancelamento é gratuito até 48h antes da partida.
      </AlertBox>
      
      <AlertBox 
        type="success" 
        icon={CheckCircle}
        title="Programa de fidelidade"
      >
        Você acumulou 30 pontos no programa Milhas Sênior!
      </AlertBox>
    </div>
  );
}
