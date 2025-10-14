import React, { useState, useRef } from "react";
import { StandardModal } from "@/components/ui-custom/StandardModal";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";
import { LocationApi } from "@/api/location/location.api";
import type { StandardLocation } from "@/api/location/types";
import type { CreateRadarBody } from "@/api/radar/types";
import { AlertCircle, Mail, MessageSquare, ChevronDown } from "lucide-react";

interface NovoRadarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    partida: string;
    destino: string;
    inicio: string;
    fim: string;
    milhas: boolean;
  }) => void;
  prefilledParams?: {
    origem?: string;
    destino?: string;
    inicio?: string;
    fim?: string;
    valor?: number;
    tipo?: 'MONEY' | 'AIRMILES';
  };
}

export function NovoRadarModal({ isOpen, onClose, onCreate, prefilledParams }: NovoRadarModalProps) {
  // Utilitário para data de hoje no formato yyyy-mm-dd
  const todayStr = new Date().toISOString().split('T')[0];

  const [partida, setPartida] = useState("");
  const [destino, setDestino] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [milhas, setMilhas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [habilitarDatas, setHabilitarDatas] = useState(false);
  const [habilitarAlertaPreco, setHabilitarAlertaPreco] = useState(false);

  // Estados para alerta de preço
  const [valorLimite, setValorLimite] = useState("");
  const [tipoMoeda, setTipoMoeda] = useState<"reais" | "milhas">("reais");
  const [showMoedaDropdown, setShowMoedaDropdown] = useState(false);
  const [notificarEmail, setNotificarEmail] = useState(true);
  const [notificarTelegram, setNotificarTelegram] = useState(true);
  const [valorLimiteError, setValorLimiteError] = useState("");

  // Estados para novos filtros
  const [companhiaAerea, setCompanhiaAerea] = useState("");
  const [tipoViagem, setTipoViagem] = useState<"ONE_WAY" | "ROUND_TRIP">("ONE_WAY");
  const [showTipoViagemDropdown, setShowTipoViagemDropdown] = useState(false);
  
  const { token } = useAuthStore();

  // Autocomplete states
  const [partidaSuggestions, setPartidaSuggestions] = useState<StandardLocation[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState<StandardLocation[]>([]);
  const [showPartidaDropdown, setShowPartidaDropdown] = useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState<StandardLocation[]>([]);
  const [selectedDestino, setSelectedDestino] = useState<StandardLocation[]>([]);
  // Mensagens de erro para seleção obrigatória
  const [partidaError, setPartidaError] = useState("");
  const [destinoError, setDestinoError] = useState("");

  // Loading states for suggestions
  const [loadingPartida, setLoadingPartida] = useState(false);
  const [loadingDestino, setLoadingDestino] = useState(false);

  // Refs para ignorar busca ao selecionar do droplist
  const ignorePartidaEffectRef = useRef(false);
  const ignoreDestinoEffectRef = useRef(false);

  // Refs para AbortController para cancelar requisições
  const partidaAbortControllerRef = useRef<AbortController | null>(null);
  const destinoAbortControllerRef = useRef<AbortController | null>(null);

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

  // Função para alternar seleção de uma localização individual (só uma OU todas)
  const toggleLocationSelection = (location: StandardLocation, selectedLocations: StandardLocation[], setSelected: React.Dispatch<React.SetStateAction<StandardLocation[]>>) => {
    const cityKey = location.cityCode || location.city || location.code || location.name;
    
    if (isLocationSelected(location, selectedLocations)) {
      // Remove a localização selecionada
      setSelected(selectedLocations.filter(selected => selected.code !== location.code));
    } else {
      // Remove todas as outras localizações desta cidade e adiciona apenas esta
      const otherCityLocations = selectedLocations.filter(selected => {
        const selectedCityKey = selected.cityCode || selected.city || selected.code || selected.name;
        return selectedCityKey !== cityKey;
      });
      setSelected([...otherCityLocations, location]);
    }
  };

  // Função para alternar seleção de todas as localizações de uma cidade
  const toggleCitySelection = (cityLocations: StandardLocation[], selectedLocations: StandardLocation[], setSelected: React.Dispatch<React.SetStateAction<StandardLocation[]>>) => {
    const isAllSelected = isAllCitySelected(cityLocations, selectedLocations);
    const cityKey = cityLocations[0]?.cityCode || cityLocations[0]?.city || cityLocations[0]?.code || cityLocations[0]?.name;
    
    if (isAllSelected) {
      // Remove todas as localizações desta cidade
      const otherLocations = selectedLocations.filter(selected => {
        const selectedCityKey = selected.cityCode || selected.city || selected.code || selected.name;
        return selectedCityKey !== cityKey;
      });
      setSelected(otherLocations);
    } else {
      // Remove qualquer seleção individual desta cidade e adiciona todas
      const otherCityLocations = selectedLocations.filter(selected => {
        const selectedCityKey = selected.cityCode || selected.city || selected.code || selected.name;
        return selectedCityKey !== cityKey;
      });
      setSelected([...otherCityLocations, ...cityLocations]);
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

  // Debounce para busca de sugestões com cancelamento de requisições
  React.useEffect(() => {
    if (ignorePartidaEffectRef.current) {
      ignorePartidaEffectRef.current = false;
      return;
    }

    // Cancelar requisição anterior se existir
    if (partidaAbortControllerRef.current) {
      partidaAbortControllerRef.current.abort();
    }

    const handler = setTimeout(() => {
      if (partida.length >= 3) {
        setLoadingPartida(true);
        
        // Criar novo AbortController para esta requisição
        const controller = new AbortController();
        partidaAbortControllerRef.current = controller;
        
        LocationApi.listLocations(partida, controller.signal)
          .then((res) => {
            if (!controller.signal.aborted) {
              setPartidaSuggestions(res.locations);
              setShowPartidaDropdown(true);
            }
          })
          .catch((error) => {
            // Ignora erros de cancelamento (AbortError ou CanceledError)
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
              console.error('Erro ao buscar sugestões de partida:', error);
              setPartidaSuggestions([]);
              setShowPartidaDropdown(false);
            }
          })
          .finally(() => {
            if (!controller.signal.aborted) {
              setLoadingPartida(false);
            }
          });
      } else {
        setPartidaSuggestions([]);
        setShowPartidaDropdown(false);
        setLoadingPartida(false);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
      // Cancelar requisição se o component for desmontado ou o termo mudar
      if (partidaAbortControllerRef.current) {
        partidaAbortControllerRef.current.abort();
      }
    };
  }, [partida]);

  React.useEffect(() => {
    if (ignoreDestinoEffectRef.current) {
      ignoreDestinoEffectRef.current = false;
      return;
    }

    // Cancelar requisição anterior se existir
    if (destinoAbortControllerRef.current) {
      destinoAbortControllerRef.current.abort();
    }

    const handler = setTimeout(() => {
      if (destino.length >= 3) {
        setLoadingDestino(true);
        
        // Criar novo AbortController para esta requisição
        const controller = new AbortController();
        destinoAbortControllerRef.current = controller;
        
        LocationApi.listLocations(destino, controller.signal)
          .then((res) => {
            if (!controller.signal.aborted) {
              setDestinoSuggestions(res.locations);
              setShowDestinoDropdown(true);
            }
          })
          .catch((error) => {
            // Ignora erros de cancelamento (AbortError ou CanceledError)
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
              console.error('Erro ao buscar sugestões de destino:', error);
              setDestinoSuggestions([]);
              setShowDestinoDropdown(false);
            }
          })
          .finally(() => {
            if (!controller.signal.aborted) {
              setLoadingDestino(false);
            }
          });
      } else {
        setDestinoSuggestions([]);
        setShowDestinoDropdown(false);
        setLoadingDestino(false);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
      // Cancelar requisição se o component for desmontado ou o termo mudar
      if (destinoAbortControllerRef.current) {
        destinoAbortControllerRef.current.abort();
      }
    };
  }, [destino]);

  // Cleanup quando o modal é fechado
  React.useEffect(() => {
    if (!isOpen) {
      // Cancelar requisições pendentes quando o modal é fechado
      if (partidaAbortControllerRef.current) {
        partidaAbortControllerRef.current.abort();
        partidaAbortControllerRef.current = null;
      }
      if (destinoAbortControllerRef.current) {
        destinoAbortControllerRef.current.abort();
        destinoAbortControllerRef.current = null;
      }
    }
  }, [isOpen]);

  // Prefill form when prefilledParams is provided
  React.useEffect(() => {
    if (prefilledParams && isOpen) {
      console.log('🎤 Prefilling radar form with voice params:', prefilledParams);

      // Fetch and set locations for origem
      if (prefilledParams.origem) {
        LocationApi.listLocations(prefilledParams.origem)
          .then((res) => {
            if (res.locations && res.locations.length > 0) {
              const location = res.locations.find(loc => loc.code === prefilledParams.origem) || res.locations[0];
              setSelectedPartida([location]);
              setPartida(location.name);
            }
          })
          .catch(err => console.error('Error fetching origem:', err));
      }

      // Fetch and set locations for destino
      if (prefilledParams.destino) {
        LocationApi.listLocations(prefilledParams.destino)
          .then((res) => {
            if (res.locations && res.locations.length > 0) {
              const location = res.locations.find(loc => loc.code === prefilledParams.destino) || res.locations[0];
              setSelectedDestino([location]);
              setDestino(location.name);
            }
          })
          .catch(err => console.error('Error fetching destino:', err));
      }

      // Set dates if provided
      if (prefilledParams.inicio || prefilledParams.fim) {
        setHabilitarDatas(true);
        if (prefilledParams.inicio) setInicio(prefilledParams.inicio);
        if (prefilledParams.fim) setFim(prefilledParams.fim);
      }

      // Set price alert if provided
      if (prefilledParams.valor) {
        setHabilitarAlertaPreco(true);
        setValorLimite(prefilledParams.valor.toString());
      }

      // Set type (MONEY or AIRMILES)
      if (prefilledParams.tipo) {
        setTipoMoeda(prefilledParams.tipo === 'AIRMILES' ? 'milhas' : 'reais');
      }
    }
  }, [prefilledParams, isOpen]);

  const formContent = (
    <form className="flex flex-col gap-4 mt-2 px-2 max-h-[70vh] overflow-y-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Partida</label>
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={selectedPartida.length > 0 ? getSelectedDisplayText(selectedPartida) : partida}
              onChange={e => {
                setPartida(e.target.value);
                setSelectedPartida([]);
                setPartidaError("");
              }}
              onFocus={() => partida.length >= 3 && setShowPartidaDropdown(true)}
              onBlur={() => setTimeout(() => setShowPartidaDropdown(false), 150)}
              className={`w-full border rounded-lg px-3 py-2 pr-10 h-10 ${partidaError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Cidade de origem"
              disabled={selectedPartida.length > 0}
            />
            {selectedPartida.length > 0 && (
              <button
                type="button"
                aria-label="Remover seleção de partida"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => {
                  setSelectedPartida([]);
                  setPartida("");
                  setPartidaSuggestions([]);
                  setPartidaError("");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          {(showPartidaDropdown || loadingPartida) && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
              {loadingPartida && (
                <li className="px-4 py-2 text-gray-500 italic flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                  Procurando...
                </li>
              )}
              {!loadingPartida && partidaSuggestions.length > 0 && (() => {
                const groupedLocations = groupLocationsByCity(partidaSuggestions);
                return Object.entries(groupedLocations).map(([cityKey, cityLocations]) => (
                  <li key={cityKey} className="border-b border-gray-100 last:border-b-0">
                    {cityLocations.length > 1 && (
                      <div 
                        className="px-4 py-2 bg-gray-50 font-medium text-econotrip-blue cursor-pointer hover:bg-econotrip-blue/10 flex items-center justify-between"
                        onMouseDown={() => {
                          ignorePartidaEffectRef.current = true;
                          toggleCitySelection(cityLocations, selectedPartida, setSelectedPartida);
                          setPartida(getSelectedDisplayText([...selectedPartida, ...cityLocations.filter(loc => !isLocationSelected(loc, selectedPartida))]));
                          setShowPartidaDropdown(false);
                          setPartidaError("");
                        }}
                      >
                        <span>{cityLocations[0].city} (qualquer)</span>
                        <span className="text-xs">
                          {isAllCitySelected(cityLocations, selectedPartida) ? '✓ Todos' : 'Selecionar todos'}
                        </span>
                      </div>
                    )}
                    {cityLocations.map((loc) => (
                      <div
                        key={loc.code}
                        className={`px-4 py-2 cursor-pointer hover:bg-econotrip-blue/10 flex items-center justify-between text-left ${
                          cityLocations.length > 1 ? 'pl-8' : ''
                        } ${isLocationSelected(loc, selectedPartida) ? 'bg-econotrip-blue/5' : ''}`}
                        onMouseDown={() => {
                          ignorePartidaEffectRef.current = true;
                          toggleLocationSelection(loc, selectedPartida, setSelectedPartida);
                          const newSelected = isLocationSelected(loc, selectedPartida) 
                            ? selectedPartida.filter(selected => selected.code !== loc.code)
                            : [...selectedPartida, loc];
                          setPartida(getSelectedDisplayText(newSelected));
                          setShowPartidaDropdown(false);
                          setPartidaError("");
                        }}
                      >
                        <span>
                          <span className="font-semibold text-econotrip-blue">{loc.code}</span> - {loc.name}
                        </span>
                        {isLocationSelected(loc, selectedPartida) && (
                          <span className="text-econotrip-blue">✓</span>
                        )}
                      </div>
                    ))}
                  </li>
                ));
              })()}
              {!loadingPartida && partidaSuggestions.length === 0 && (
                <li className="px-4 py-2 text-gray-400 italic text-left">Nenhum resultado</li>
              )}
            </ul>
          )}
          {partidaError && <p className="text-xs text-red-500 mt-1">{partidaError}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Destino</label>
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={selectedDestino.length > 0 ? getSelectedDisplayText(selectedDestino) : destino}
              onChange={e => {
                setDestino(e.target.value);
                setSelectedDestino([]);
                setDestinoError("");
              }}
              onFocus={() => destino.length >= 3 && setShowDestinoDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestinoDropdown(false), 150)}
              className={`w-full border rounded-lg px-3 py-2 pr-10 h-10 ${destinoError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Cidade de destino"
              disabled={selectedDestino.length > 0}
            />
            {selectedDestino.length > 0 && (
              <button
                type="button"
                aria-label="Remover seleção de destino"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => {
                  setSelectedDestino([]);
                  setDestino("");
                  setDestinoSuggestions([]);
                  setDestinoError("");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          {(showDestinoDropdown || loadingDestino) && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
              {loadingDestino && (
                <li className="px-4 py-2 text-gray-500 italic flex items-center gap-2">
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
                          ignoreDestinoEffectRef.current = true;
                          toggleCitySelection(cityLocations, selectedDestino, setSelectedDestino);
                          setDestino(getSelectedDisplayText([...selectedDestino, ...cityLocations.filter(loc => !isLocationSelected(loc, selectedDestino))]));
                          setShowDestinoDropdown(false);
                          setDestinoError("");
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
                        className={`px-4 py-2 cursor-pointer hover:bg-econotrip-orange/10 flex items-center justify-between text-left ${
                          cityLocations.length > 1 ? 'pl-8' : ''
                        } ${isLocationSelected(loc, selectedDestino) ? 'bg-econotrip-orange/5' : ''}`}
                        onMouseDown={() => {
                          ignoreDestinoEffectRef.current = true;
                          toggleLocationSelection(loc, selectedDestino, setSelectedDestino);
                          const newSelected = isLocationSelected(loc, selectedDestino) 
                            ? selectedDestino.filter(selected => selected.code !== loc.code)
                            : [...selectedDestino, loc];
                          setDestino(getSelectedDisplayText(newSelected));
                          setShowDestinoDropdown(false);
                          setDestinoError("");
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
                <li className="px-4 py-2 text-gray-400 italic text-left">Nenhum resultado</li>
              )}
            </ul>
          )}
          {destinoError && <p className="text-xs text-red-500 mt-1">{destinoError}</p>}
        </div>
      </div>
      
      {/* Tipo de radar - MONEY ou AIRMILES */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Tipo de monitoramento</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoedaDropdown(!showMoedaDropdown)}
            onBlur={() => setTimeout(() => setShowMoedaDropdown(false), 150)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-econotrip-orange/20 focus:border-econotrip-orange flex items-center justify-between text-sm h-10"
          >
            <span>{tipoMoeda === "reais" ? "R$ (Reais)" : "Milhas"}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showMoedaDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm"
                onMouseDown={() => {
                  setTipoMoeda("reais");
                  setShowMoedaDropdown(false);
                }}
              >
                R$ (Reais)
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm border-t border-gray-100"
                onMouseDown={() => {
                  setTipoMoeda("milhas");
                  setShowMoedaDropdown(false);
                }}
              >
                Milhas
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Escolha se deseja monitorar preços em reais ou milhas</p>
      </div>

      {/* Tipo de viagem - Ida ou Ida e Volta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Tipo de viagem</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTipoViagemDropdown(!showTipoViagemDropdown)}
            onBlur={() => setTimeout(() => setShowTipoViagemDropdown(false), 150)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-econotrip-blue/20 focus:border-econotrip-blue flex items-center justify-between text-sm h-10"
          >
            <span>{tipoViagem === "ONE_WAY" ? "Somente Ida" : "Ida e Volta"}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          {showTipoViagemDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm"
                onMouseDown={() => {
                  setTipoViagem("ONE_WAY");
                  setShowTipoViagemDropdown(false);
                }}
              >
                Somente Ida
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 text-sm border-t border-gray-100"
                onMouseDown={() => {
                  setTipoViagem("ROUND_TRIP");
                  setShowTipoViagemDropdown(false);
                }}
              >
                Ida e Volta
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {tipoViagem === "ROUND_TRIP"
            ? "Buscaremos os voos de retorno mais baratos em um intervalo de 15 dias"
            : "Apenas voos de ida serão monitorados"
          }
        </p>
      </div>

      {/* Filtro de Companhia Aérea (apenas para Milhas) */}
      {tipoMoeda === "milhas" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Companhia Aérea (opcional)</label>
          <input
            type="text"
            value={companhiaAerea}
            onChange={(e) => setCompanhiaAerea(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-10"
            placeholder="Ex: LATAM, Gol, Azul..."
          />
          <p className="text-xs text-gray-500 mt-1">Deixe em branco para monitorar todas as companhias</p>
        </div>
      )}
      
      {/* Checkbox para habilitar período específico */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="habilitarDatas"
          checked={habilitarDatas}
          onChange={(e) => {
            setHabilitarDatas(e.target.checked);
            if (!e.target.checked) {
              setInicio("");
              setFim("");
            }
          }}
          className="w-4 h-4 text-econotrip-blue bg-gray-100 border-gray-300 rounded focus:ring-econotrip-blue focus:ring-2"
        />
        <label htmlFor="habilitarDatas" className="text-sm font-medium text-gray-700 cursor-pointer">
          Definir período específico para monitoramento
        </label>
      </div>
      
      {habilitarDatas && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Data de início</label>
            <input 
              type="date" 
              value={inicio} 
              onChange={e => setInicio(e.target.value)} 
              min={todayStr} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-10" 
            />
            <p className="text-xs text-gray-500 mt-1">A partir de quando monitorar os preços</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Data de fim</label>
            <input 
              type="date" 
              value={fim} 
              onChange={e => setFim(e.target.value)} 
              min={inicio || todayStr} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-10" 
            />
            <p className="text-xs text-gray-500 mt-1">Até quando monitorar os preços</p>
          </div>
        </>
      )}
      
      {/* Checkbox para habilitar alerta de preço */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="habilitarAlertaPreco"
          checked={habilitarAlertaPreco}
          onChange={(e) => {
            setHabilitarAlertaPreco(e.target.checked);
            if (!e.target.checked) {
              setValorLimite("");
              setTipoMoeda("reais");
              setValorLimiteError("");
            }
          }}
          className="w-4 h-4 text-econotrip-orange bg-gray-100 border-gray-300 rounded focus:ring-econotrip-orange focus:ring-2"
        />
        <label htmlFor="habilitarAlertaPreco" className="text-sm font-medium text-gray-700 cursor-pointer">
          Ativar alerta de preço personalizado
        </label>
      </div>
      
      {habilitarAlertaPreco && (
        <>
          {/* Seção de Alerta de Preço - Design Minimalista */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            {/* Cabeçalho */}
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-econotrip-orange" />
              <h3 className="text-lg font-semibold text-gray-800">Alerta de Preço</h3>
            </div>
            
            {/* Descrição */}
            <p className="text-sm text-gray-600 mb-4">
              Defina um valor limite e receba notificações quando encontrarmos preços abaixo deste valor.
            </p>
            
            {/* Campo de valor */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Valor limite
              </label>
              <input
                type="number"
                value={valorLimite}
                onChange={e => {
                  setValorLimite(e.target.value);
                  setValorLimiteError("");
                }}
                className={`w-full border rounded-lg px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-econotrip-orange/20 focus:border-econotrip-orange ${
                  valorLimiteError 
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
                    : 'border-gray-300'
                }`}
                placeholder="0,00"
                min="0"
                step="0.01"
              />
              
              {/* Mensagens de feedback */}
              {valorLimiteError && (
                <p className="text-sm text-red-600">{valorLimiteError}</p>
              )}
              
              {!valorLimiteError && valorLimite && (
                <p className="text-sm text-gray-600">
                  Você será notificado quando o preço estiver abaixo de{' '}
                  <span className="font-medium text-econotrip-orange">
                    {valorLimite} {tipoMoeda === "reais" ? "reais" : "milhas"}
                  </span>
                </p>
              )}
              
              {!valorLimiteError && !valorLimite && (
                <p className="text-sm text-gray-500">
                  Digite um valor para ativar o alerta de preço
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </form>
  );

  const handleConfirm = async () => {
    let valid = true;
    if (selectedPartida.length === 0) {
      setPartidaError("Selecione uma opção do droplist de partida.");
      valid = false;
    }
    if (selectedDestino.length === 0) {
      setDestinoError("Selecione uma opção do droplist de destino.");
      valid = false;
    }
    if (habilitarAlertaPreco && valorLimite && (parseFloat(valorLimite) <= 0 || isNaN(parseFloat(valorLimite)))) {
      setValorLimiteError("Digite um valor válido maior que zero.");
      valid = false;
    }
    if (habilitarAlertaPreco && valorLimite && (!notificarEmail && !notificarTelegram)) {
      setValorLimiteError("Selecione pelo menos uma forma de notificação.");
      valid = false;
    }
    if (!token || !valid) return;

    setLoading(true);
    try {
      const radarData: CreateRadarBody = {
        origin: selectedPartida.map(loc => loc.code).filter(Boolean).join(','),
        destination: selectedDestino.map(loc => loc.code).filter(Boolean).join(','),
        start: habilitarDatas ? inicio : undefined,
        end: habilitarDatas ? fim : undefined,
        value: habilitarAlertaPreco && valorLimite ? parseFloat(valorLimite) : undefined,
        type: tipoMoeda === 'milhas' ? 'AIRMILES' : 'MONEY',
        airline: companhiaAerea.trim() || undefined,
        tripType: tipoViagem,
        returnDateRange: tipoViagem === 'ROUND_TRIP' ? 15 : undefined, // Intervalo fixo de 15 dias
      };

      await RadarService.create(token, radarData);

      // Limpar formulário
      setPartida("");
      setDestino("");
      setInicio("");
      setFim("");
      setMilhas(false);
      setHabilitarDatas(false);
      setHabilitarAlertaPreco(false);
      setValorLimite("");
      setTipoMoeda("reais");
      setShowMoedaDropdown(false);
      setNotificarEmail(true);
      setNotificarTelegram(true);
      setSelectedPartida([]);
      setSelectedDestino([]);
      setPartidaError("");
      setDestinoError("");
      setValorLimiteError("");
      setCompanhiaAerea("");
      setTipoViagem("ONE_WAY");
      setShowTipoViagemDropdown(false);

      onCreate({ partida, destino, inicio, fim, milhas });
    } catch (e) {
      // Trate erro se necessário
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      type="info"
      title="Novo Radar"
      confirmText={loading ? "Criando..." : "Criar Radar"}
      cancelText="Cancelar"
      showCancel
      showIcon={false}
    >
      {formContent}
    </StandardModal>
  );
}
