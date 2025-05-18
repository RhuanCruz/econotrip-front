
import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { LeafyGreen, Accessibility } from "lucide-react";

const mockFlights = [
  {
    id: "flight-1",
    origin: "São Paulo",
    originCode: "GRU",
    destination: "Lisboa",
    destinationCode: "LIS",
    date: "10/03/2024",
    price: 2350.0,
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
    isLowEmission: false,
    isAccessible: false,
    isBestValue: true,
  },
];

export default function ResultsScreen() {
  const navigate = useNavigate();

  const handleViewDetails = (flightId: string) => {
    // In a real app, we would navigate to the details page with the flight id
    console.log(`Viewing details for flight ${flightId}`);
    // This would be: navigate(`/detalhes-voo/${flightId}`);
    alert(`Detalhes do voo ${flightId} seriam exibidos aqui.`);
  };

  const handleNewSearch = () => {
    navigate("/busca-voos");
  };

  return (
    <LayoutBase>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-museomoderno font-bold text-econotrip-blue mb-8">
          Voos encontrados
        </h1>

        <div className="space-y-6">
          {mockFlights.map((flight) => (
            <Card
              key={flight.id}
              className="transition-all hover:shadow-md"
            >
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
                    <div className="flex items-center text-econotrip-green">
                      <LeafyGreen className="h-5 w-5 mr-1" />
                      <span>Baixa emissão de carbono</span>
                    </div>
                  )}
                  
                  {flight.isAccessible && (
                    <div className="flex items-center text-econotrip-blue">
                      <Accessibility className="h-5 w-5 mr-1" />
                      <span>Acessível para passageiros com mobilidade reduzida</span>
                    </div>
                  )}
                  
                  {flight.isBestValue && (
                    <div className="flex items-center text-econotrip-orange">
                      <span className="font-semibold">✓ Melhor custo-benefício</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleViewDetails(flight.id)}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="primary"
            size="lg"
            onClick={handleNewSearch}
          >
            Nova busca
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
}
