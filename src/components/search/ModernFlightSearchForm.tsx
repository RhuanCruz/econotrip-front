import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Search, MapPin, Calendar, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { motion } from "framer-motion";
import { LocationApi } from "@/api/location/location.api";
import type { StandardLocation } from "@/api/location/types";

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
  const [origemSuggestions, setOrigemSuggestions] = React.useState<StandardLocation[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = React.useState<StandardLocation[]>([]);
  const [loadingOrigem, setLoadingOrigem] = React.useState(false);
  const [loadingDestino, setLoadingDestino] = React.useState(false);
  const [showOrigemDropdown, setShowOrigemDropdown] = React.useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = React.useState(false);

  // Adiciona estados para armazenar o Location selecionado (agora suporta múltiplas seleções)
  const [selectedOrigem, setSelectedOrigem] = React.useState<StandardLocation[]>([]);
  const [selectedDestino, setSelectedDestino] = React.useState<StandardLocation[]>([]);

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

  // Função para agrupar localizações por cidade/código
  const groupLocationsByCity = (locations: StandardLocation[]) => {
    const groups: { [key: string]: StandardLocation[] } = {};
    
    locations.forEach(location => {
      const groupKey = location.cityCode || location.city || location.code || location.name;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(location);
    });
    
    return groups;
  };

  // Função para verificar se uma localização está selecionada
  const isLocationSelected = (location: StandardLocation, selectedLocations: StandardLocation[]) => {
    return selectedLocations.some(selected => selected.code === location.code);
  };

  // Função para verificar se todas as localizações de uma cidade estão selecionadas
  const isAllCitySelected = (cityLocations: StandardLocation[], selectedLocations: StandardLocation[]) => {
    return cityLocations.every(location => isLocationSelected(location, selectedLocations));
  };

  // Função para alternar seleção de uma localização individual
  const toggleLocationSelection = (location: StandardLocation, selectedLocations: StandardLocation[], setSelected: React.Dispatch<React.SetStateAction<StandardLocation[]>>) => {
    if (isLocationSelected(location, selectedLocations)) {
      setSelected(selectedLocations.filter(selected => selected.code !== location.code));
    } else {
      setSelected([...selectedLocations, location]);
    }
  };

  // Função para alternar seleção de todas as localizações de uma cidade
  const toggleCitySelection = (cityLocations: StandardLocation[], selectedLocations: StandardLocation[], setSelected: React.Dispatch<React.SetStateAction<StandardLocation[]>>) => {
    const isAllSelected = isAllCitySelected(cityLocations, selectedLocations);
    
    if (isAllSelected) {
      // Remove todas as localizações desta cidade
      const otherLocations = selectedLocations.filter(selected => 
        !cityLocations.some(cityLoc => cityLoc.code === selected.code)
      );
      setSelected(otherLocations);
    } else {
      // Adiciona todas as localizações desta cidade que não estão selecionadas
      const newSelections = cityLocations.filter(cityLoc => 
        !isLocationSelected(cityLoc, selectedLocations)
      );
      setSelected([...selectedLocations, ...newSelections]);
    }
  };

  // Função para obter o texto de exibição das seleções
  const getSelectedDisplayText = (selectedLocations: StandardLocation[]) => {
    if (selectedLocations.length === 0) return "";
    if (selectedLocations.length === 1) return selectedLocations[0].name;
    
    // Group by cityCode and show city names
    const cities = Array.from(new Set(selectedLocations.map(loc => loc.cityCode || loc.city || loc.name)));
    if (cities.length === 1) {
      // Use the city name for display, not the cityCode
      const cityName = selectedLocations[0].city || selectedLocations[0].cityCode || selectedLocations[0].name;
      return `${cityName} (qualquer)`;
    }
    return cities.map(cityKey => {
      // Find a location with this cityKey to get the display name
      const loc = selectedLocations.find(l => (l.cityCode || l.city || l.name) === cityKey);
      return loc?.city || cityKey;
    }).join(', ');
  };

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
            setOrigemSuggestions(res.locations);
            setShowOrigemDropdown(true);
          })
          .catch((error) => {
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
            setDestinoSuggestions(res.locations);
            setShowDestinoDropdown(true);
          })
          .catch((error) => {
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
    getOrigemBusca: () => {
      if (selectedOrigem.length > 0) {
        return selectedOrigem.map(loc => loc.code).join(',');
      }
      return formData.origem;
    },
    getDestinoBusca: () => {
      if (selectedDestino.length > 0) {
        return selectedDestino.map(loc => loc.code).join(',');
      }
      return formData.destino;
    },
  }));

  return (
    <div className="space-y-3">
      {/* Trip Type Selector */}
      <div className="bg-white rounded-2xl p-3 shadow-lg">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTripType('one-way')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
              tripType === 'one-way'
                ? 'bg-white text-econotrip-blue shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Só ida
          </button>
          <button
            onClick={() => setTripType('round-trip')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
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
        <div className="p-4 border-b border-gray-100">
          <div className="space-y-3">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">De onde</label>
              <div className="relative">
                <div className="flex items-center">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-econotrip-blue pointer-events-none" />
                  <input
                    type="text"
                    placeholder="São Paulo, Brasil"
                    value={selectedOrigem.length > 0 ? getSelectedDisplayText(selectedOrigem) : (formData.origem || "")}
                    onChange={(e) => {
                      onInputChange("origem", e.target.value);
                      setSelectedOrigem([]);
                    }}
                    onFocus={() => formData.origem && formData.origem.length >= 3 && setShowOrigemDropdown(true)}
                    onBlur={() => setTimeout(() => setShowOrigemDropdown(false), 150)}
                    className={`w-full pl-10 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent text-base transition disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed`}
                    disabled={selectedOrigem.length > 0}
                  />
                  {selectedOrigem.length > 0 && (
                    <button
                      type="button"
                      aria-label="Remover seleção de origem"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full p-1 shadow"
                      style={{ zIndex: 30 }}
                      onClick={() => {
                        setSelectedOrigem([]);
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
                    {!loadingOrigem && origemSuggestions.length > 0 && (() => {
                      const groupedLocations = groupLocationsByCity(origemSuggestions);
                      return Object.entries(groupedLocations).map(([cityKey, cityLocations]) => (
                        <li key={cityKey} className="border-b border-gray-100 last:border-b-0">
                          {cityLocations.length > 1 && (
                            <div 
                              className="px-4 py-2 bg-gray-50 font-medium text-econotrip-blue cursor-pointer hover:bg-econotrip-blue/10 flex items-center justify-between"
                              onMouseDown={() => {
                                origemSelectBySuggestion.current = true;
                                toggleCitySelection(cityLocations, selectedOrigem, setSelectedOrigem);
                                onInputChange("origem", getSelectedDisplayText([...selectedOrigem, ...cityLocations.filter(loc => !isLocationSelected(loc, selectedOrigem))]));
                                setShowOrigemDropdown(false);
                              }}
                            >
                              <span>{cityLocations[0].city} (qualquer)</span>
                              <span className="text-xs">
                                {isAllCitySelected(cityLocations, selectedOrigem) ? '✓ Todos' : 'Selecionar todos'}
                              </span>
                            </div>
                          )}
                          {cityLocations.map((loc) => (
                            <div
                              key={loc.code}
                              className={`px-4 py-2 cursor-pointer hover:bg-econotrip-blue/10 flex items-center justify-between ${
                                cityLocations.length > 1 ? 'pl-8' : ''
                              } ${isLocationSelected(loc, selectedOrigem) ? 'bg-econotrip-blue/5' : ''}`}
                              onMouseDown={() => {
                                origemSelectBySuggestion.current = true;
                                toggleLocationSelection(loc, selectedOrigem, setSelectedOrigem);
                                const newSelected = isLocationSelected(loc, selectedOrigem) 
                                  ? selectedOrigem.filter(selected => selected.code !== loc.code)
                                  : [...selectedOrigem, loc];
                                onInputChange("origem", getSelectedDisplayText(newSelected));
                                setShowOrigemDropdown(false);
                              }}
                            >
                              <span>
                                <span className="font-semibold text-econotrip-blue">{loc.code}</span> - {loc.name}
                              </span>
                              {isLocationSelected(loc, selectedOrigem) && (
                                <span className="text-econotrip-blue">✓</span>
                              )}
                            </div>
                          ))}
                        </li>
                      ));
                    })()}
                    {!loadingOrigem && origemSuggestions.length === 0 && (
                      <li className="px-4 py-2 text-gray-400 italic text-center">Nenhum resultado</li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Swap Button - Integrado */}
            {/* <div className="flex justify-end -mt-2 mb-1">
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
                className="w-8 h-8 bg-gray-100 hover:bg-econotrip-blue hover:text-white rounded-lg flex items-center justify-center text-gray-600 transition-all duration-200 shadow-sm"
                title="Inverter origem e destino"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div> */}

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Para onde</label>
              <div className="relative">
                <div className="flex items-center">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-econotrip-orange pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Lisboa, Portugal"
                    value={selectedDestino.length > 0 ? getSelectedDisplayText(selectedDestino) : (formData.destino || "")}
                    onChange={(e) => {
                      onInputChange("destino", e.target.value);
                      setSelectedDestino([]);
                    }}
                    onFocus={() => formData.destino && formData.destino.length >= 3 && setShowDestinoDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDestinoDropdown(false), 150)}
                    className={`w-full pl-10 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-orange focus:border-transparent text-base transition disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed`}
                    disabled={selectedDestino.length > 0}
                  />
                  {selectedDestino.length > 0 && (
                    <button
                      type="button"
                      aria-label="Remover seleção de destino"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none bg-white rounded-full p-1 shadow"
                      style={{ zIndex: 30 }}
                      onClick={() => {
                        setSelectedDestino([]);
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
                    {!loadingDestino && destinoSuggestions.length > 0 && (() => {
                      const groupedLocations = groupLocationsByCity(destinoSuggestions);
                      return Object.entries(groupedLocations).map(([cityKey, cityLocations]) => (
                        <li key={cityKey} className="border-b border-gray-100 last:border-b-0">
                          {cityLocations.length > 1 && (
                            <div 
                              className="px-4 py-2 bg-gray-50 font-medium text-econotrip-orange cursor-pointer hover:bg-econotrip-orange/10 flex items-center justify-between"
                              onMouseDown={() => {
                                destinoSelectBySuggestion.current = true;
                                toggleCitySelection(cityLocations, selectedDestino, setSelectedDestino);
                                onInputChange("destino", getSelectedDisplayText([...selectedDestino, ...cityLocations.filter(loc => !isLocationSelected(loc, selectedDestino))]));
                                setShowDestinoDropdown(false);
                              }}
                            >
                              <span>{cityLocations[0].city} (qualquer)</span>
                              <span className="text-xs">
                                {isAllCitySelected(cityLocations, selectedDestino) ? '✓ Todos' : 'Selecionar todos'}
                              </span>
                            </div>
                          )}
                          {cityLocations.map((loc) => (
                            <div
                              key={loc.code}
                              className={`px-4 py-2 cursor-pointer hover:bg-econotrip-orange/10 flex items-center justify-between ${
                                cityLocations.length > 1 ? 'pl-8' : ''
                              } ${isLocationSelected(loc, selectedDestino) ? 'bg-econotrip-orange/5' : ''}`}
                              onMouseDown={() => {
                                destinoSelectBySuggestion.current = true;
                                toggleLocationSelection(loc, selectedDestino, setSelectedDestino);
                                const newSelected = isLocationSelected(loc, selectedDestino) 
                                  ? selectedDestino.filter(selected => selected.code !== loc.code)
                                  : [...selectedDestino, loc];
                                onInputChange("destino", getSelectedDisplayText(newSelected));
                                setShowDestinoDropdown(false);
                              }}
                            >
                              <span>
                                <span className="font-semibold text-econotrip-orange">{loc.code}</span> - {loc.name}
                              </span>
                              {isLocationSelected(loc, selectedDestino) && (
                                <span className="text-econotrip-orange">✓</span>
                              )}
                            </div>
                          ))}
                        </li>
                      ));
                    })()}
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
        <div className="p-4 border-b border-gray-100">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Partida</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-econotrip-blue" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.dataIda}
                  onChange={(e) => onInputChange("dataIda", e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent"
                />
              </div>
            </div>
            {tripType === 'round-trip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Retorno</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-econotrip-orange" />
                  <input
                    type="date"
                    min={formData.dataIda || new Date().toISOString().split('T')[0]}
                    value={formData.dataVolta}
                    onChange={(e) => onInputChange("dataVolta", e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-orange focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Passengers & Class */}
        <div className="p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passageiros</label>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 h-5 w-5 text-econotrip-blue" />
                <div className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 text-base font-medium text-econotrip-blue">
                  {getTotalPassengers()} {getTotalPassengers() === 1 ? 'Passageiro' : 'Passageiros'}
                </div>
              </div>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Classe</label>
              <select
                value={formData.classe}
                onChange={(e) => onInputChange("classe", e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-econotrip-blue focus:border-transparent text-base"
                disabled
              >
                <option value="economica">Econômica</option>
                <option value="executiva">Executiva</option>
                <option value="primeira">Primeira</option>
              </select>
            </div> */}
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
          <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
            <h3 className="text-lg font-semibold text-econotrip-blue mb-3">Opções Avançadas</h3>
            <div className="space-y-2.5">
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
      <div className="pt-1">
        <Button
          onClick={onSearch}
          icon={Search}
          size="lg"
          className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          Buscar Voos
        </Button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Encontraremos as melhores opções para você!
        </p>
      </div>
    </div>
  );
});
