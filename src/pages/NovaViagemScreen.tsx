import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plus, Navigation, X, Loader2, MapPin, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { PlannerService } from "@/api/planner/PlannerService";
import { StandardModal, ModalType } from "@/components/ui-custom/StandardModal";
import { LocationApi } from "@/api/location/location.api";
import type { GeoNameItem } from "@/api/location/types";

interface Destino {
  id: string;
  cidade: string;
  duracao: number;
  selecionado: boolean;
}

export default function NovaViagemScreen() {
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info" as ModalType,
    title: "",
    description: ""
  });
  const [form, setForm] = useState({
    partida: "",
    inicio: "",
    pessoas: 1,
    estilo: "",
  });

  // Estado para destinos (começa com um destino principal)
  const [destinos, setDestinos] = useState<Destino[]>([
    { id: "principal", cidade: "", duracao: 7, selecionado: false }
  ]);

  // Estados para sugestões de cidades
  const [partidaSuggestions, setPartidaSuggestions] = useState<GeoNameItem[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState<{ [key: string]: GeoNameItem[] }>({});
  const [showPartidaDropdown, setShowPartidaDropdown] = useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = useState<{ [key: string]: boolean }>({});
  const [loadingPartidaSuggestions, setLoadingPartidaSuggestions] = useState(false);
  const [loadingDestinoSuggestions, setLoadingDestinoSuggestions] = useState<{ [key: string]: boolean }>({});
  
  // Estados para controlar se uma cidade foi selecionada
  const [partidaSelecionada, setPartidaSelecionada] = useState(false);

  const { token } = useAuthStore();

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Função para buscar cidades
  const searchCities = async (query: string, isPartida: boolean, destinoId?: string) => {
    if (query.length < 3) {
      if (isPartida) {
        setPartidaSuggestions([]);
        setShowPartidaDropdown(false);
      } else if (destinoId) {
        setDestinoSuggestions(prev => ({ ...prev, [destinoId]: [] }));
        setShowDestinoDropdown(prev => ({ ...prev, [destinoId]: false }));
      }
      return;
    }

    // Não buscar se uma cidade já foi selecionada
    if (isPartida && partidaSelecionada) {
      return;
    }
    
    if (!isPartida && destinoId) {
      const destino = destinos.find(d => d.id === destinoId);
      if (destino?.selecionado) {
        return;
      }
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      if (isPartida) {
        setLoadingPartidaSuggestions(true);
      } else if (destinoId) {
        setLoadingDestinoSuggestions(prev => ({ ...prev, [destinoId]: true }));
      }

      const response = await LocationApi.searchCities(query, abortControllerRef.current.signal);
      
      if (isPartida) {
        setPartidaSuggestions(response.geonames);
        setShowPartidaDropdown(true);
        setLoadingPartidaSuggestions(false);
      } else if (destinoId) {
        setDestinoSuggestions(prev => ({ ...prev, [destinoId]: response.geonames }));
        setShowDestinoDropdown(prev => ({ ...prev, [destinoId]: true }));
        setLoadingDestinoSuggestions(prev => ({ ...prev, [destinoId]: false }));
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Erro ao buscar cidades:', error);
      }
      if (isPartida) {
        setLoadingPartidaSuggestions(false);
      } else if (destinoId) {
        setLoadingDestinoSuggestions(prev => ({ ...prev, [destinoId]: false }));
      }
    }
  };

  // Debounce para as buscas
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleCitySearch = (value: string, isPartida: boolean, destinoId?: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchCities(value, isPartida, destinoId);
    }, 300);
  };

  // Selecionar cidade da sugestão
  const selectCity = (city: GeoNameItem, isPartida: boolean, destinoId?: string) => {
    const cityName = `${city.name}, ${city.adminName1 ? city.adminName1 + ', ' : ''}${city.countryName}`;
    
    if (isPartida) {
      setForm(prev => ({ ...prev, partida: cityName }));
      setShowPartidaDropdown(false);
      setPartidaSuggestions([]);
      setPartidaSelecionada(true);
    } else if (destinoId) {
      setDestinos(prev => prev.map(d => 
        d.id === destinoId 
          ? { ...d, cidade: cityName, selecionado: true }
          : d
      ));
      setShowDestinoDropdown(prev => ({ ...prev, [destinoId]: false }));
      setDestinoSuggestions(prev => ({ ...prev, [destinoId]: [] }));
    }
  };

  // Limpar seleção de cidade
  const clearCitySelection = (isPartida: boolean, destinoId?: string) => {
    if (isPartida) {
      setForm(prev => ({ ...prev, partida: "" }));
      setPartidaSelecionada(false);
      setPartidaSuggestions([]);
      setShowPartidaDropdown(false);
    } else if (destinoId) {
      setDestinos(prev => prev.map(d => 
        d.id === destinoId 
          ? { ...d, cidade: "", selecionado: false }
          : d
      ));
      setDestinoSuggestions(prev => ({ ...prev, [destinoId]: [] }));
      setShowDestinoDropdown(prev => ({ ...prev, [destinoId]: false }));
    }
  };

  // Adicionar destino adicional
  const adicionarDestino = () => {
    const novoDestino: Destino = {
      id: crypto.randomUUID(),
      cidade: "",
      duracao: 3,
      selecionado: false
    };
    setDestinos(prev => [...prev, novoDestino]);
  };

  // Remover destino (exceto o principal)
  const removerDestino = (destinoId: string) => {
    if (destinoId !== "principal" && destinos.length > 1) {
      setDestinos(prev => prev.filter(d => d.id !== destinoId));
      // Limpar estados relacionados
      setDestinoSuggestions(prev => {
        const { [destinoId]: removed, ...rest } = prev;
        return rest;
      });
      setShowDestinoDropdown(prev => {
        const { [destinoId]: removed, ...rest } = prev;
        return rest;
      });
      setLoadingDestinoSuggestions(prev => {
        const { [destinoId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  // Atualizar duração
  const atualizarDuracao = (destinoId: string, duracao: number) => {
    setDestinos(prev => prev.map(d => 
      d.id === destinoId ? { ...d, duracao } : d
    ));
  };

  // Atualizar cidade
  const atualizarCidade = (destinoId: string, cidade: string) => {
    setDestinos(prev => prev.map(d => 
      d.id === destinoId ? { ...d, cidade, selecionado: false } : d
    ));
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Trigger city search for partida input
    if (name === 'partida') {
      if (!partidaSelecionada) {
        handleCitySearch(value, true);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Calcular duração total
    const duracaoTotal = destinos.reduce((acc, d) => acc + d.duracao, 0);
    if (duracaoTotal > 30) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Duração muito longa",
        description: "A duração total da viagem não pode exceder 30 dias."
      });
      return;
    }

    // Verificar se há pelo menos um destino preenchido
    const destinosPreenchidos = destinos.filter(d => d.cidade.trim() !== '');
    if (destinosPreenchidos.length === 0) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Destino obrigatório",
        description: "Informe pelo menos um destino para sua viagem."
      });
      return;
    }

    setLoading(true);
    setModalConfig({
      isOpen: true,
      type: "info",
      title: "Criando viagem...",
      description: "Aguarde enquanto processamos sua solicitação."
    });

    console.log("Form data:", form);
    console.log("Destinos:", destinosPreenchidos);

    const plannerBody = {
      start: form.inicio,
      duration: duracaoTotal,
      amountPeople: Number(form.pessoas),
      tripStyle: form.estilo,
      origin: form.partida,
      destination: destinosPreenchidos.map(destino => ({
        city: destino.cidade,
        duration: destino.duracao
      }))
    };

    try {
      const roteiro = await PlannerService.generate(token, plannerBody);
      setLoading(false);
      setModalConfig({ ...modalConfig, isOpen: false });
      navigate("/roteiro-gerado", { state: { roteiro, start: plannerBody.start, duration: plannerBody.duration, destination: plannerBody.destination } });
    } catch (error) {
      setLoading(false);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Erro ao criar viagem",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente."
      });
    }
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header moderno */}
        <motion.div variants={itemAnimation} className="text-center py-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-econotrip-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Plus className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
            Simular Nova Viagem
          </h1>
        </motion.div>
      </motion.div>
      <Card className="max-w-md w-full p-2 rounded-3xl shadow-xl bg-white/90">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Partida</label>
            <div className="relative">
              <input
                type="text"
                name="partida"
                value={form.partida}
                onChange={handleChange}
                onFocus={() => !partidaSelecionada && form.partida.length >= 3 && setShowPartidaDropdown(true)}
                onBlur={() => setTimeout(() => setShowPartidaDropdown(false), 200)}
                required
                readOnly={partidaSelecionada}
                className={`w-full h-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue ${partidaSelecionada ? 'bg-gray-50 cursor-default' : ''} ${loadingPartidaSuggestions ? 'pr-8' : ''}`}
                placeholder={partidaSelecionada ? form.partida : "São Paulo, Rio de Janeiro..."}
              />
              {loadingPartidaSuggestions && !partidaSelecionada && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              {partidaSelecionada && (
                <button
                  type="button"
                  onClick={() => clearCitySelection(true)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {showPartidaDropdown && !partidaSelecionada && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {loadingPartidaSuggestions ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Buscando cidades...</span>
                    </div>
                  </div>
                ) : partidaSuggestions.length > 0 ? (
                  partidaSuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectCity(city, true)}
                    >
                      <div className="font-medium text-gray-900">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {city.adminName1 && `${city.adminName1}, `}{city.countryName}
                      </div>
                    </div>
                  ))
                ) : form.partida.length >= 3 ? (
                  <div className="p-3 text-center text-gray-500">
                    Nenhuma cidade encontrada
                  </div>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Destinos - Seção compacta */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Destinos</label>
            
            {destinos.map((destino, index) => (
              <div key={destino.id} className={`relative ${index > 0 ? 'bg-gray-50 rounded-lg p-3' : ''}`}>
                {index > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Destino adicional {index}</span>
                    <button
                      type="button"
                      onClick={() => removerDestino(destino.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={destino.cidade}
                      onChange={(e) => {
                        atualizarCidade(destino.id, e.target.value);
                        if (!destino.selecionado) {
                          handleCitySearch(e.target.value, false, destino.id);
                        }
                      }}
                      onFocus={() => !destino.selecionado && destino.cidade.length >= 3 && setShowDestinoDropdown(prev => ({ ...prev, [destino.id]: true }))}
                      onBlur={() => setTimeout(() => setShowDestinoDropdown(prev => ({ ...prev, [destino.id]: false })), 200)}
                      required
                      readOnly={destino.selecionado}
                      className={`w-full h-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue ${destino.selecionado ? 'bg-gray-50 cursor-default' : ''} ${loadingDestinoSuggestions[destino.id] ? 'pr-8' : ''}`}
                      placeholder={index === 0 ? "Paris, Londres, Tóquio..." : "Próximo destino..."}
                    />
                    {loadingDestinoSuggestions[destino.id] && !destino.selecionado && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    {destino.selecionado && (
                      <button
                        type="button"
                        onClick={() => clearCitySelection(false, destino.id)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X size={16} />
                      </button>
                    )}
                    
                    {/* Dropdown de sugestões */}
                    {showDestinoDropdown[destino.id] && !destino.selecionado && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {loadingDestinoSuggestions[destino.id] ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Buscando cidades...</span>
                            </div>
                          </div>
                        ) : destinoSuggestions[destino.id]?.length > 0 ? (
                          destinoSuggestions[destino.id].map((city, cityIndex) => (
                            <div
                              key={cityIndex}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => selectCity(city, false, destino.id)}
                            >
                              <div className="font-medium text-gray-900">
                                {city.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {city.adminName1 && `${city.adminName1}, `}{city.countryName}
                              </div>
                            </div>
                          ))
                        ) : destino.cidade.length >= 3 ? (
                          <div className="p-3 text-center text-gray-500">
                            Nenhuma cidade encontrada
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={destino.duracao}
                      onChange={(e) => atualizarDuracao(destino.id, Number(e.target.value))}
                      required
                      className="w-16 h-10 border rounded-lg px-2 text-center focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
                    />
                    <span className="text-sm text-gray-600">dias</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Botão para adicionar destino */}
            <button
              type="button"
              onClick={adicionarDestino}
              className="w-full h-10 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-econotrip-blue hover:border-econotrip-blue transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              <span className="text-sm">Adicionar outro destino</span>
            </button>
            
            {/* Resumo da duração */}
            {destinos.length > 1 && (
              <div className="text-center text-sm text-gray-600 bg-blue-50 rounded-lg p-2">
                <span className="font-medium">Total: {destinos.reduce((acc, d) => acc + d.duracao, 0)} dias</span>
                {destinos.reduce((acc, d) => acc + d.duracao, 0) > 30 && (
                  <div className="text-red-600 text-xs mt-1">⚠️ Máximo 30 dias</div>
                )}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
            <input
              type="date"
              name="inicio"
              min={new Date().toISOString().split('T')[0]}
              value={form.inicio}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Pessoas</label>
            <input
              type="number"
              name="pessoas"
              min={1}
              value={form.pessoas}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estilo de Viagem</label>
            <select
              name="estilo"
              value={form.estilo}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue"
            >
              <option value="">Selecione</option>
              <option value="economico">Econômico</option>
              <option value="medio">Médio</option>
              <option value="luxo">Luxo</option>
            </select>
          </div>
          <Button
            type="submit"
            icon={Plus}
            size="lg"
            className="w-full bg-gradient-to-r from-econotrip-blue to-econotrip-blue/90 hover:from-econotrip-blue/90 hover:to-econotrip-blue text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
          >
            Criar Roteiro
          </Button>
        </form>
      </Card>
      <StandardModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        type={modalConfig.type}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText="Aguarde..."
        showCancel={false}
      />
    </div>
  );
}
