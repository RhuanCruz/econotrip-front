
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { User, Info, Calendar, Mail } from "lucide-react";

interface PassengerData {
  name: string;
  cpf: string;
  birthdate: string;
  email: string;
}

interface PassengerInfoProps {
  passengerData: PassengerData;
}

export function PassengerInfo({ passengerData }: PassengerInfoProps) {
  return (
    <Card className="mb-8 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
        Dados do Passageiro
      </h2>
      
      <div className="space-y-4 text-lg">
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <User className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">Nome Completo</p>
            <p className="text-gray-700">{passengerData.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <Info className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">CPF</p>
            <p className="text-gray-700">{passengerData.cpf}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <Calendar className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">Data de Nascimento</p>
            <p className="text-gray-700">{passengerData.birthdate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <Mail className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">E-mail</p>
            <p className="text-gray-700">{passengerData.email}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
