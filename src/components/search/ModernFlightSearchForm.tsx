
import React from "react";
import { Search, MapPin, Calendar, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";

interface FormData {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  passageiros: {
    adults: number;
    children: number;
    infants: number;
  };
  classe: string;
  usarMilhas: boolean;
  filtros: {
    melhorPreco: boolean;
    acessibilidade: boolean;
    sustentavel: boolean;
    voosDiretos: boolean;
  };
  orcamento: string;
  somenteDireto: boolean;
  voosSustentaveis: boolean;
  tarifasFlexiveis: boolean;
  acessibilidade: boolean;
}

interface ModernFlightSearchFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  onPassengerChange: (type: keyof FormData["passageiros"], increment: boolean) => void;
  onSearch: () => void;
}

export function ModernFlightSearchForm({
  formData,
  onInputChange,
  onPassengerChange,
  onSearch
}: ModernFlightSearchFormProps) {
  const [tripType, setTripType] = React.useState<'one-way' | 'round-trip'>('round-trip');
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const getTotalPassengers = () => {
    return formData.passageiros.adults + formData.passageiros.children + formData.passageiros.infants;
  };

  return (
    <div className="space-y-6">
      {/* Trip Type Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTripType('one-way')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              tripType === 'one-way'
                ? 'bg-white text-econotrip-blue shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Só ida
          </button>
          <button
            onClick={() => setTripType('round-trip')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              tripType === 'round-trip'
                ? 'bg-white text-econotrip-blue shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Ida e volta
          </button>
        </div>
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Route Selection */}
        <div className="p-6 border-b border-gray-100">
          <div className="space-y-4">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">De onde</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-econotrip-blue" />
                <input
                  type="text"
                  placeholder="São Paulo, Brasil"
                  value={formData.origem}
                  onChange={(e) => onInputChange("origem", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button className="w-10 h-10 bg-econotrip-blue rounded-full flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Para onde</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-econotrip-orange" />
                <input
                  type="text"
                  placeholder="Lisboa, Portugal"
                  value={formData.destino}
                  onChange={(e) => onInputChange("destino", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-orange focus:border-transparent text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="p-6 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Partida</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 h-5 w-5 text-econotrip-blue" />
                <input
                  type="date"
                  value={formData.dataIda}
                  onChange={(e) => onInputChange("dataIda", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent"
                />
              </div>
            </div>
            
            {tripType === 'round-trip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Retorno</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 h-5 w-5 text-econotrip-orange" />
                  <input
                    type="date"
                    value={formData.dataVolta}
                    onChange={(e) => onInputChange("dataVolta", e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-orange focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Passengers & Class */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passageiros</label>
              <div className="relative">
                <Users className="absolute left-4 top-4 h-5 w-5 text-econotrip-blue" />
                <div className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-gray-50 text-lg font-medium text-econotrip-blue">
                  {getTotalPassengers()} {getTotalPassengers() === 1 ? 'Passageiro' : 'Passageiros'}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classe</label>
              <select
                value={formData.classe}
                onChange={(e) => onInputChange("classe", e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent text-lg"
              >
                <option value="economica">Econômica</option>
                <option value="executiva">Executiva</option>
                <option value="primeira">Primeira</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <motion.div
        initial={false}
        animate={{ height: showAdvanced ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        {showAdvanced && (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-econotrip-blue mb-4">Opções Avançadas</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.usarMilhas}
                  onChange={(e) => onInputChange("usarMilhas", e.target.checked)}
                  className="w-5 h-5 text-econotrip-orange rounded"
                />
                <span className="text-gray-700">Usar milhas</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.filtros.voosDiretos}
                  onChange={(e) => onInputChange("filtros", {
                    ...formData.filtros,
                    voosDiretos: e.target.checked
                  })}
                  className="w-5 h-5 text-econotrip-orange rounded"
                />
                <span className="text-gray-700">Apenas voos diretos</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.filtros.sustentavel}
                  onChange={(e) => onInputChange("filtros", {
                    ...formData.filtros,
                    sustentavel: e.target.checked
                  })}
                  className="w-5 h-5 text-econotrip-green rounded"
                />
                <span className="text-gray-700">Voos sustentáveis</span>
              </label>
            </div>
          </div>
        )}
      </motion.div>

      {/* Advanced Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 mx-auto text-econotrip-blue font-medium"
        >
          <Settings className="h-4 w-4" />
          {showAdvanced ? 'Ocultar' : 'Mostrar'} opções avançadas
        </button>
      </div>

      {/* Search Button */}
      <div className="pt-4">
        <Button
          onClick={onSearch}
          className="w-full h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <Search className="mr-3 h-6 w-6" />
          Buscar Voos
        </Button>
        <p className="text-center text-sm text-gray-500 mt-3">
          Encontraremos as melhores opções para você!
        </p>
      </div>
    </div>
  );
}
