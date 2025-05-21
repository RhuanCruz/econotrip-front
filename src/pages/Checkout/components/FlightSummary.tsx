
import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Calendar, Clock, Plane } from "lucide-react";

interface FlightData {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  date: string;
  time: string;
  duration: string;
  stops: string;
  price: number;
}

interface FlightSummaryProps {
  flightData: FlightData;
}

export function FlightSummary({ flightData }: FlightSummaryProps) {
  return (
    <Card className="mb-8 p-6 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-2xl font-museomoderno font-bold text-econotrip-blue mb-4">
        Resumo do Voo
      </h2>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-xl mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
                <span className="font-bold text-xs">BR</span>
              </div>
              <span className="text-xs font-medium">{flightData.originCode}</span>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-300 relative h-6">
              <Plane className="h-5 w-5 text-econotrip-blue absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
                <span className="font-bold text-xs">PT</span>
              </div>
              <span className="text-xs font-medium">{flightData.destinationCode}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between px-2">
            <div className="text-center">
              <h3 className="font-medium text-econotrip-blue">{flightData.origin}</h3>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-econotrip-blue">{flightData.destination}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 text-lg">
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <Calendar className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">Data</p>
            <p className="text-gray-700">{flightData.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <Clock className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">Horário e Duração</p>
            <p className="text-gray-700">{flightData.time} • {flightData.duration}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <Plane className="h-6 w-6 text-econotrip-blue flex-shrink-0" />
          <div>
            <p className="font-medium text-econotrip-blue">Tipo de Voo</p>
            <p className="text-gray-700">{flightData.stops}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Valor total</p>
          <p className="text-3xl md:text-4xl font-bold text-econotrip-orange">
            R$ {flightData.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}
