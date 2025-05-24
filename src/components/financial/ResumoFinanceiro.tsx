
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Plane, Building, Car, UtensilsCrossed, Shield, Calculator } from "lucide-react";

interface CustoViagem {
  passagem: number;
  hospedagem: number;
  transporte: number;
  alimentacao: number;
  seguro: number;
}

interface ResumoFinanceiroProps {
  custos: CustoViagem;
  dias: number;
}

export function ResumoFinanceiro({ custos, dias }: ResumoFinanceiroProps) {
  const total = Object.values(custos).reduce((sum, value) => sum + value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const itens = [
    {
      label: "Passagem aérea",
      value: custos.passagem,
      icon: Plane,
      color: "text-econotrip-blue",
    },
    {
      label: "Hospedagem",
      value: custos.hospedagem,
      icon: Building,
      color: "text-econotrip-orange",
    },
    {
      label: "Transporte local",
      value: custos.transporte,
      icon: Car,
      color: "text-econotrip-green",
    },
    {
      label: `Alimentação (${dias} dias)`,
      value: custos.alimentacao,
      icon: UtensilsCrossed,
      color: "text-purple-600",
    },
    {
      label: "Seguro viagem",
      value: custos.seguro,
      icon: Shield,
      color: "text-red-600",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-econotrip-blue" />
        <h2 className="text-2xl font-museomoderno font-bold text-econotrip-blue">
          Resumo financeiro da viagem
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        {itens.map((item) => {
          const Icon = item.icon;
          const porcentagem = (item.value / total) * 100;
          
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-lg">{item.label}</span>
                </div>
                <span className="text-lg font-medium">{formatCurrency(item.value)}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r from-econotrip-blue to-econotrip-orange`}
                  style={{ width: `${porcentagem}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-2xl font-bold">
          <span className="text-econotrip-blue">Total estimado:</span>
          <span className="text-econotrip-orange">{formatCurrency(total)}</span>
        </div>
        <p className="text-gray-600 text-center mt-2">
          Valores aproximados para {dias} dias de viagem
        </p>
      </div>
    </Card>
  );
}
