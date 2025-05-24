
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Lightbulb, Calendar, Clock, TrendingDown } from "lucide-react";

export function DicasEconomia() {
  const dicas = [
    {
      icon: Calendar,
      titulo: "Evite finais de semana",
      descricao: "Voos de terça a quinta são até 30% mais baratos",
      color: "text-econotrip-blue",
    },
    {
      icon: Clock,
      titulo: "Antecedência é economia",
      descricao: "Compre com 30-60 dias de antecedência para melhores preços",
      color: "text-econotrip-orange",
    },
    {
      icon: TrendingDown,
      titulo: "Baixa temporada",
      descricao: "Viaje em março-maio ou agosto-novembro para economizar",
      color: "text-econotrip-green",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-6 w-6 text-econotrip-orange" />
        <h3 className="text-xl font-museomoderno font-bold text-econotrip-blue">
          Dicas para economizar
        </h3>
      </div>

      <div className="space-y-4">
        {dicas.map((dica, index) => {
          const Icon = dica.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${dica.color}`} />
              </div>
              <div>
                <h4 className="font-medium text-econotrip-blue mb-1">{dica.titulo}</h4>
                <p className="text-gray-600">{dica.descricao}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
