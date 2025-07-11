import React, { useState, useRef } from "react";
import { StandardModal } from "@/components/ui-custom/StandardModal";
import { RadarService } from "@/api/radar/RadarService";
import { useAuthStore } from "@/stores/authStore";
import { LocationApi } from "@/api/location/location.api";
import type { Location } from "@/api/location/types";
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
}

export function NovoRadarModal({ isOpen, onClose, onCreate }: NovoRadarModalProps) {
  // Utilitário para data de hoje no formato yyyy-mm-dd
  const todayStr = new Date().toISOString().split('T')[0];

  const [partida, setPartida] = useState("");
  const [destino, setDestino] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [milhas, setMilhas] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para alerta de preço
  const [valorLimite, setValorLimite] = useState("");
  const [tipoMoeda, setTipoMoeda] = useState<"reais" | "milhas">("reais");
  const [showMoedaDropdown, setShowMoedaDropdown] = useState(false);
  const [notificarEmail, setNotificarEmail] = useState(true);
  const [notificarTelegram, setNotificarTelegram] = useState(true);
  const [valorLimiteError, setValorLimiteError] = useState("");
  
  const { token } = useAuthStore();

  // Autocomplete states
  const [partidaSuggestions, setPartidaSuggestions] = useState<Location[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState<Location[]>([]);
  const [showPartidaDropdown, setShowPartidaDropdown] = useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState<Location | null>(null);
  const [selectedDestino, setSelectedDestino] = useState<Location | null>(null);
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
            // Verificar se a requisição não foi cancelada
            if (!controller.signal.aborted) {
              setPartidaSuggestions(res.data);
              setShowPartidaDropdown(true);
            }
          })
          .catch((error) => {
            // Ignorar erros de cancelamento
            if (error.name !== 'AbortError') {
              console.error('Erro ao buscar sugestões de partida:', error);
              setPartidaSuggestions([]);
              setShowPartidaDropdown(false);
            }
          })
          .finally(() => {
            // Só atualizar loading se não foi cancelada
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
            // Verificar se a requisição não foi cancelada
            if (!controller.signal.aborted) {
              setDestinoSuggestions(res.data);
              setShowDestinoDropdown(true);
            }
          })
          .catch((error) => {
            // Ignorar erros de cancelamento
            if (error.name !== 'AbortError') {
              console.error('Erro ao buscar sugestões de destino:', error);
              setDestinoSuggestions([]);
              setShowDestinoDropdown(false);
            }
          })
          .finally(() => {
            // Só atualizar loading se não foi cancelada
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

  const formContent = (
    <form className="flex flex-col gap-4 mt-2 px-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Partida</label>
        <div className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={partida}
              onChange={e => {
                setPartida(e.target.value);
                setSelectedPartida(null);
                setPartidaError("");
              }}
              onFocus={() => partida.length >= 3 && setShowPartidaDropdown(true)}
              onBlur={() => setTimeout(() => setShowPartidaDropdown(false), 150)}
              className={`w-full border rounded-lg px-3 py-2 pr-10 ${partidaError ? 'border-red-500' : ''}`}
              placeholder="Cidade de origem"
              disabled={!!selectedPartida}
            />
            {selectedPartida && (
              <button
                type="button"
                aria-label="Remover seleção de partida"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => {
                  setSelectedPartida(null);
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
              {!loadingPartida && partidaSuggestions.length > 0 && partidaSuggestions.map((loc) => (
                <li
                  key={loc.navigation.entityId}
                  className="px-4 py-2 cursor-pointer hover:bg-econotrip-blue/10 text-left"
                  onMouseDown={() => {
                    ignorePartidaEffectRef.current = true;
                    setPartida(`${loc.presentation.suggestionTitle}`);
                    setSelectedPartida(loc);
                    setShowPartidaDropdown(false);
                    setPartidaError("");
                  }}
                >
                  <span className="font-semibold text-econotrip-blue">{loc.navigation.relevantFlightParams.skyId}</span> - {loc.presentation.suggestionTitle}
                </li>
              ))}
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
              value={destino}
              onChange={e => {
                setDestino(e.target.value);
                setSelectedDestino(null);
                setDestinoError("");
              }}
              onFocus={() => destino.length >= 3 && setShowDestinoDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestinoDropdown(false), 150)}
              className={`w-full border rounded-lg px-3 py-2 pr-10 ${destinoError ? 'border-red-500' : ''}`}
              placeholder="Cidade de destino"
              disabled={!!selectedDestino}
            />
            {selectedDestino && (
              <button
                type="button"
                aria-label="Remover seleção de destino"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => {
                  setSelectedDestino(null);
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
              {!loadingDestino && destinoSuggestions.length > 0 && destinoSuggestions.map((loc) => (
                <li
                  key={loc.navigation.entityId}
                  className="px-4 py-2 cursor-pointer hover:bg-econotrip-orange/10 text-left"
                  onMouseDown={() => {
                    ignoreDestinoEffectRef.current = true;
                    setDestino(`${loc.presentation.suggestionTitle}`);
                    setSelectedDestino(loc);
                    setShowDestinoDropdown(false);
                    setDestinoError("");
                  }}
                >
                  <span className="font-semibold text-econotrip-orange">{loc.navigation.relevantFlightParams.skyId}</span> - {loc.presentation.suggestionTitle}
                </li>
              ))}
              {!loadingDestino && destinoSuggestions.length === 0 && (
                <li className="px-4 py-2 text-gray-400 italic text-left">Nenhum resultado</li>
              )}
            </ul>
          )}
          {destinoError && <p className="text-xs text-red-500 mt-1">{destinoError}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Início</label>
        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} min={todayStr} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Fim</label>
        <input type="date" value={fim} onChange={e => setFim(e.target.value)} min={inicio || todayStr} className="w-full border rounded-lg px-3 py-2" />
      </div>
      
      {/* Seção de Alerta de Preço */}
      <div className="border-t pt-4 mt-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 -mx-2">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-econotrip-orange" />
          <h3 className="text-lg font-semibold text-econotrip-blue">Alerta de Preço</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Defina um valor limite e receba notificações quando encontrarmos preços abaixo deste valor.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Valor limite</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={valorLimite}
                  onChange={e => {
                    setValorLimite(e.target.value);
                    setValorLimiteError("");
                  }}
                  className={`w-full border rounded-lg px-3 py-2 bg-white ${valorLimiteError ? 'border-red-500' : ''}`}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoedaDropdown(!showMoedaDropdown)}
                  onBlur={() => setTimeout(() => setShowMoedaDropdown(false), 150)}
                  className="border rounded-lg px-3 py-2 bg-white min-w-[100px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-econotrip-blue focus:border-transparent flex items-center justify-between"
                >
                  <span>{tipoMoeda === "reais" ? "R$ (Reais)" : "Milhas"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showMoedaDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      onMouseDown={() => {
                        setTipoMoeda("reais");
                        setShowMoedaDropdown(false);
                      }}
                    >
                      R$ (Reais)
                    </button>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
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
            </div>
            {valorLimiteError && <p className="text-xs text-red-500 mt-1">{valorLimiteError}</p>}
            {!valorLimiteError && (
              <p className="text-xs text-gray-500 mt-1">
                {valorLimite 
                  ? `Você será notificado quando o preço estiver abaixo de ${valorLimite} ${tipoMoeda === "reais" ? "reais" : "milhas"}`
                  : "Digite um valor para receber alertas de preço"
                }
              </p>
            )}
          </div>
        
        </div>
      </div>
    </form>
  );

  const handleConfirm = async () => {
    let valid = true;
    if (!selectedPartida) {
      setPartidaError("Selecione uma opção do droplist de partida.");
      valid = false;
    }
    if (!selectedDestino) {
      setDestinoError("Selecione uma opção do droplist de destino.");
      valid = false;
    }
    if (valorLimite && (parseFloat(valorLimite) <= 0 || isNaN(parseFloat(valorLimite)))) {
      setValorLimiteError("Digite um valor válido maior que zero.");
      valid = false;
    }
    if (valorLimite && (!notificarEmail && !notificarTelegram)) {
      setValorLimiteError("Selecione pelo menos uma forma de notificação.");
      valid = false;
    }
    if (!token || !valid) return;
    
    setLoading(true);
    try {
      const radarData: CreateRadarBody = {
        origin: selectedPartida.navigation.relevantFlightParams.skyId,
        destination: selectedDestino.navigation.relevantFlightParams.skyId,
        start: inicio,
        end: fim,
        value: parseFloat(valorLimite),
        type: tipoMoeda === 'milhas' ? 'AIRMILES' : 'MONEY',
      };
          
      await RadarService.create(token, radarData);
      
      // Limpar formulário
      setPartida("");
      setDestino("");
      setInicio("");
      setFim("");
      setMilhas(false);
      setValorLimite("");
      setTipoMoeda("reais");
      setShowMoedaDropdown(false);
      setNotificarEmail(true);
      setNotificarTelegram(true);
      setSelectedPartida(null);
      setSelectedDestino(null);
      setPartidaError("");
      setDestinoError("");
      setValorLimiteError("");
      
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
      description={formContent as unknown as string}
      confirmText={loading ? "Criando..." : "Criar Radar"}
      cancelText="Cancelar"
      showCancel
    />
  );
}
