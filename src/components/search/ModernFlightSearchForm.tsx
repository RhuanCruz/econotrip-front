import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Search, MapPin, Calendar, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";
import { LocationApi } from "@/api/location/location.api";
import type { Location } from "@/api/location/types";

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
  onInputChange: (field: keyof FormData, value: string | boolean | FormData["passageiros"] | FormData["filtros"]) => void;
  onPassengerChange: (type: keyof FormData["passageiros"], increment: boolean) => void;
  onSearch: () => void;
}

export const ModernFlightSearchForm = forwardRef(function ModernFlightSearchForm({
  formData,
  onInputChange,
  onPassengerChange,
  onSearch
}: ModernFlightSearchFormProps, ref) {
  const [tripType, setTripType] = React.useState<'one-way' | 'round-trip'>('one-way');
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [origemSuggestions, setOrigemSuggestions] = React.useState<Location[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = React.useState<Location[]>([]);
  const [loadingOrigem, setLoadingOrigem] = React.useState(false);
  const [loadingDestino, setLoadingDestino] = React.useState(false);
  const [showOrigemDropdown, setShowOrigemDropdown] = React.useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = React.useState(false);

  // Adiciona estados para armazenar o Location selecionado
  const [selectedOrigem, setSelectedOrigem] = React.useState<Location | null>(null);
  const [selectedDestino, setSelectedDestino] = React.useState<Location | null>(null);

  // Refs para ignorar busca ao selecionar do droplist
  const ignoreNextOrigemEffectRef = useRef(false);
  const ignoreNextDestinoEffectRef = useRef(false);

  // Ref para evitar busca ao selecionar sugestão
  const origemSelectBySuggestion = React.useRef(false);
  const destinoSelectBySuggestion = React.useRef(false);

  // Debounce para busca de origem/destino
  const origemDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const destinoDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // AbortController para cancelar requisições anteriores
  const origemAbortControllerRef = useRef<AbortController | null>(null);
  const destinoAbortControllerRef = useRef<AbortController | null>(null);

  // Flag para evitar busca durante a troca de origem/destino
  const isSwappingRef = useRef(false);

  // Busca sugestões para origem (com debounce e cancelamento)
  React.useEffect(() => {
    if (origemSelectBySuggestion.current || isSwappingRef.current) {
      origemSelectBySuggestion.current = false;
      return;
    }
    
    // Cancela requisição anterior se existir
    if (origemAbortControllerRef.current) {
      origemAbortControllerRef.current.abort();
    }
    
    if (origemDebounceRef.current) clearTimeout(origemDebounceRef.current);
    
    if (formData.origem && formData.origem.length >= 3) {
      origemDebounceRef.current = setTimeout(() => {
        // Cria novo AbortController para esta requisição
        origemAbortControllerRef.current = new AbortController();
        
        setLoadingOrigem(true);
        LocationApi.listLocations(formData.origem, origemAbortControllerRef.current.signal)
          .then((res) => {
            setOrigemSuggestions(res.data);
            setShowOrigemDropdown(true);
          })
          .catch((error) => {
            // Só mostra erro se não foi cancelada
            if (error.name !== 'AbortError') {
              console.error('Erro ao buscar origem:', error);
            }
          })
          .finally(() => setLoadingOrigem(false));
      }, 400);
    } else {
      setOrigemSuggestions([]);
      setShowOrigemDropdown(false);
    }
    
    // Cleanup
    return () => {
      if (origemDebounceRef.current) clearTimeout(origemDebounceRef.current);
      if (origemAbortControllerRef.current) {
        origemAbortControllerRef.current.abort();
      }
    };
  }, [formData.origem]);

  // Busca sugestões para destino (com debounce e cancelamento)
  React.useEffect(() => {
    if (destinoSelectBySuggestion.current || isSwappingRef.current) {
      destinoSelectBySuggestion.current = false;
      return;
    }
    
    // Cancela requisição anterior se existir
    if (destinoAbortControllerRef.current) {
      destinoAbortControllerRef.current.abort();
    }
    
    if (destinoDebounceRef.current) clearTimeout(destinoDebounceRef.current);
    
    if (formData.destino && formData.destino.length >= 3) {
      destinoDebounceRef.current = setTimeout(() => {
        // Cria novo AbortController para esta requisição
        destinoAbortControllerRef.current = new AbortController();
        
        setLoadingDestino(true);
        LocationApi.listLocations(formData.destino, destinoAbortControllerRef.current.signal)
          .then((res) => {
            setDestinoSuggestions(res.data);
            setShowDestinoDropdown(true);
          })
          .catch((error) => {
            // Só mostra erro se não foi cancelada
            if (error.name !== 'AbortError') {
              console.error('Erro ao buscar destino:', error);
            }
          })
          .finally(() => setLoadingDestino(false));
      }, 400);
    } else {
      setDestinoSuggestions([]);
      setShowDestinoDropdown(false);
    }
    
    // Cleanup
    return () => {
      if (destinoDebounceRef.current) clearTimeout(destinoDebounceRef.current);
      if (destinoAbortControllerRef.current) {
        destinoAbortControllerRef.current.abort();
      }
    };
  }, [formData.destino]);

  const getTotalPassengers = () => {
    return formData.passageiros.adults + formData.passageiros.children + formData.passageiros.infants;
  };

  // Exporta o valor correto para busca
  useImperativeHandle(ref, () => ({
    getOrigemBusca: () => selectedOrigem?.navigation?.relevantFlightParams?.skyId || selectedOrigem?.presentation?.suggestionTitle || formData.origem,
    getDestinoBusca: () => selectedDestino?.navigation?.relevantFlightParams?.skyId || selectedDestino?.presentation?.suggestionTitle || formData.destino,
  }));

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
                <div className="flex items-center">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-econotrip-blue pointer-events-none" />
                  <input
                    type="text"
                    placeholder="São Paulo, Brasil"
                    value={formData.origem || ""}
                    onChange={(e) => {
                      onInputChange("origem", e.target.value);
                      setSelectedOrigem(null);
                    }}
                    onFocus={() => formData.origem && formData.origem.length >= 3 && setShowOrigemDropdown(true)}
                    onBlur={() => setTimeout(() => setShowOrigemDropdown(false), 150)}
                    className={`w-full pl-12 pr-10 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent text-lg transition disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed`}
                    disabled={!!selectedOrigem}
                  />
                  {selectedOrigem && (
                    <button
                      type="button"
                      aria-label="Remover seleção de origem"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full p-1 shadow"
                      style={{ zIndex: 30 }}
                      onClick={() => {
                        setSelectedOrigem(null);
                        onInputChange("origem", "");
                        setOrigemSuggestions([]);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                {(showOrigemDropdown || loadingOrigem) && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                    {loadingOrigem && (
                      <li className="px-4 py-2 text-gray-500 italic flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                        Procurando...
                      </li>
                    )}
                    {!loadingOrigem && origemSuggestions.length > 0 && origemSuggestions.map((loc) => (
                      <li
                        key={loc.navigation.entityId}
                        className="px-4 py-2 cursor-pointer hover:bg-econotrip-blue/10"
                        onMouseDown={() => {
                          origemSelectBySuggestion.current = true;
                          onInputChange("origem", loc.presentation.suggestionTitle);
                          setSelectedOrigem(loc);
                          setShowOrigemDropdown(false);
                        }}
                      >
                        <span className="font-semibold text-econotrip-blue">{loc.navigation.relevantFlightParams.skyId}</span> - {loc.presentation.suggestionTitle}
                      </li>
                    ))}
                    {!loadingOrigem && origemSuggestions.length === 0 && (
                      <li className="px-4 py-2 text-gray-400 italic text-center">Nenhum resultado</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button 
                type="button"
                onClick={() => {
                  // Ativa flag para evitar buscas durante a troca
                  isSwappingRef.current = true;
                  
                  // Troca os valores de origem e destino
                  const tempOrigem = formData.origem || "";
                  const tempDestino = formData.destino || "";
                  const tempSelectedOrigem = selectedOrigem;
                  const tempSelectedDestino = selectedDestino;
                  
                  onInputChange("origem", tempDestino);
                  onInputChange("destino", tempOrigem);
                  setSelectedOrigem(tempSelectedDestino);
                  setSelectedDestino(tempSelectedOrigem);
                  
                  // Desativa a flag após um breve delay para permitir que os useEffect processem
                  setTimeout(() => {
                    isSwappingRef.current = false;
                  }, 100);
                }}
                className="w-10 h-10 bg-econotrip-blue rounded-full flex items-center justify-center text-white shadow-lg hover:bg-econotrip-blue/90 transition-colors touch-target"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Para onde</label>
              <div className="relative">
                <div className="flex items-center">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-econotrip-orange pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Lisboa, Portugal"
                    value={formData.destino || ""}
                    onChange={(e) => {
                      onInputChange("destino", e.target.value);
                      setSelectedDestino(null);
                    }}
                    onFocus={() => formData.destino && formData.destino.length >= 3 && setShowDestinoDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDestinoDropdown(false), 150)}
                    className={`w-full pl-12 pr-10 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-orange focus:border-transparent text-lg transition disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed`}
                    disabled={!!selectedDestino}
                  />
                  {selectedDestino && (
                    <button
                      type="button"
                      aria-label="Remover seleção de destino"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full p-1 shadow"
                      style={{ zIndex: 30 }}
                      onClick={() => {
                        setSelectedDestino(null);
                        onInputChange("destino", "");
                        setDestinoSuggestions([]);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                {(showDestinoDropdown || loadingDestino) && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                    {loadingDestino && (
                      <li className="px-4 py-2 text-gray-500 italic flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                        Procurando...
                      </li>
                    )}
                    {!loadingDestino && destinoSuggestions.length > 0 && destinoSuggestions.map((loc) => (
                      <li
                        key={loc.navigation.entityId}
                        className="px-4 py-2 cursor-pointer hover:bg-econotrip-orange/10"
                        onMouseDown={() => {
                          destinoSelectBySuggestion.current = true;
                          onInputChange("destino", loc.presentation.suggestionTitle);
                          setSelectedDestino(loc);
                          setShowDestinoDropdown(false);
                        }}
                      >
                        <span className="font-semibold text-econotrip-orange">{loc.navigation.relevantFlightParams.skyId}</span> - {loc.presentation.suggestionTitle}
                      </li>
                    ))}
                    {!loadingDestino && destinoSuggestions.length === 0 && (
                      <li className="px-4 py-2 text-gray-400 italic text-center">Nenhum resultado</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="p-6 border-b border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Partida</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 h-5 w-5 text-econotrip-blue" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
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
                    min={formData.dataIda || new Date().toISOString().split('T')[0]}
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
          <div className="space-y-4">
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
                disabled
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
          className="flex items-center gap-2 mx-auto text-econotrip-blue font-medium touch-target"
        >
          <Settings className="h-4 w-4" />
          {showAdvanced ? 'Ocultar' : 'Mostrar'} opções avançadas
        </button>
      </div>

      {/* Search Button */}
      <div className="pt-4">
        <Button
          onClick={onSearch}
          icon={Search}
          size="lg"
          className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          Buscar Voos
        </Button>
        <p className="text-center text-sm text-gray-500 mt-3">
          Encontraremos as melhores opções para você!
        </p>
      </div>
    </div>
  );
});
