import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Plus, Navigation, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { PlannerService } from "@/api/planner/PlannerService";
import { StandardModal, ModalType } from "@/components/ui-custom/StandardModal";
import { LocationApi } from "@/api/location/location.api";
import type { GeoNameItem } from "@/api/location/types";

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
    destino: "",
    inicio: "",
    duracao: 10,
    pessoas: 1,
    estilo: "",
  });

  // Estados para sugestões de cidades
  const [partidaSuggestions, setPartidaSuggestions] = useState<GeoNameItem[]>([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState<GeoNameItem[]>([]);
  const [showPartidaDropdown, setShowPartidaDropdown] = useState(false);
  const [showDestinoDropdown, setShowDestinoDropdown] = useState(false);
  const [loadingPartidaSuggestions, setLoadingPartidaSuggestions] = useState(false);
  const [loadingDestinoSuggestions, setLoadingDestinoSuggestions] = useState(false);
  
  // Estados para controlar se uma cidade foi selecionada
  const [partidaSelecionada, setPartidaSelecionada] = useState(false);
  const [destinoSelecionado, setDestinoSelecionado] = useState(false);

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
  const searchCities = async (query: string, isPartida: boolean) => {
    if (query.length < 3) {
      if (isPartida) {
        setPartidaSuggestions([]);
        setShowPartidaDropdown(false);
      } else {
        setDestinoSuggestions([]);
        setShowDestinoDropdown(false);
      }
      return;
    }

    // Não buscar se uma cidade já foi selecionada
    if ((isPartida && partidaSelecionada) || (!isPartida && destinoSelecionado)) {
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      if (isPartida) {
        setLoadingPartidaSuggestions(true);
      } else {
        setLoadingDestinoSuggestions(true);
      }

      const response = await LocationApi.searchCities(query, abortControllerRef.current.signal);
      
      if (isPartida) {
        setPartidaSuggestions(response.geonames);
        setShowPartidaDropdown(true);
        setLoadingPartidaSuggestions(false);
      } else {
        setDestinoSuggestions(response.geonames);
        setShowDestinoDropdown(true);
        setLoadingDestinoSuggestions(false);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Erro ao buscar cidades:', error);
      }
      if (isPartida) {
        setLoadingPartidaSuggestions(false);
      } else {
        setLoadingDestinoSuggestions(false);
      }
    }
  };

  // Debounce para as buscas
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleCitySearch = (value: string, isPartida: boolean) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchCities(value, isPartida);
    }, 300);
  };

  // Selecionar cidade da sugestão
  const selectCity = (city: GeoNameItem, isPartida: boolean) => {
    const cityName = `${city.name}, ${city.adminName1 ? city.adminName1 + ', ' : ''}${city.countryName}`;
    
    if (isPartida) {
      setForm(prev => ({ ...prev, partida: cityName }));
      setShowPartidaDropdown(false);
      setPartidaSuggestions([]);
      setPartidaSelecionada(true);
    } else {
      setForm(prev => ({ ...prev, destino: cityName }));
      setShowDestinoDropdown(false);
      setDestinoSuggestions([]);
      setDestinoSelecionado(true);
    }
  };

  // Limpar seleção de cidade
  const clearCitySelection = (isPartida: boolean) => {
    if (isPartida) {
      setForm(prev => ({ ...prev, partida: "" }));
      setPartidaSelecionada(false);
      setPartidaSuggestions([]);
      setShowPartidaDropdown(false);
    } else {
      setForm(prev => ({ ...prev, destino: "" }));
      setDestinoSelecionado(false);
      setDestinoSuggestions([]);
      setShowDestinoDropdown(false);
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Trigger city search for partida and destino inputs
    if (name === 'partida') {
      // Se não está selecionada, permitir busca
      if (!partidaSelecionada) {
        handleCitySearch(value, true);
      }
    } else if (name === 'destino') {
      // Se não está selecionado, permitir busca
      if (!destinoSelecionado) {
        handleCitySearch(value, false);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();    
    if (form.duracao > 20) return;
    setLoading(true);
    setModalConfig({
      isOpen: true,
      type: "info",
      title: "Criando viagem...",
      description: "Aguarde enquanto processamos sua solicitação."
    });

    console.log("Form data:", form);

    const plannerBody = {
      start: form.inicio,
      duration: Number(form.duracao),
      amountPeople: Number(form.pessoas),
      tripStyle: form.estilo,
      origin: form.partida,
      destination: form.destino,
    };

    console.log(plannerBody)

    const roteiro = await PlannerService.generate(token, plannerBody);
    navigate("/roteiro-gerado", { state: { roteiro, start: plannerBody.start, duration: plannerBody.duration } });

    setLoading(false);
    setModalConfig({ ...modalConfig, isOpen: false });
    navigate("/roteiro-gerado", { state: { roteiro, start: plannerBody.start, duration: plannerBody.duration } });

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
            className="w-20 h-20 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Plus className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-museomoderno font-bold text-econotrip-blue mb-2">
            Criar Nova Viagem
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
            <div className="relative">
              <input
                type="text"
                name="destino"
                value={form.destino}
                onChange={handleChange}
                onFocus={() => !destinoSelecionado && form.destino.length >= 3 && setShowDestinoDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestinoDropdown(false), 200)}
                required
                readOnly={destinoSelecionado}
                className={`w-full h-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue ${destinoSelecionado ? 'bg-gray-50 cursor-default' : ''} ${loadingDestinoSuggestions ? 'pr-8' : ''}`}
                placeholder={destinoSelecionado ? form.destino : "Paris, Londres, Tóquio..."}
              />
              {loadingDestinoSuggestions && !destinoSelecionado && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
              {destinoSelecionado && (
                <button
                  type="button"
                  onClick={() => clearCitySelection(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {showDestinoDropdown && !destinoSelecionado && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {loadingDestinoSuggestions ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Buscando cidades...</span>
                    </div>
                  </div>
                ) : destinoSuggestions.length > 0 ? (
                  destinoSuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectCity(city, false)}
                    >
                      <div className="font-medium text-gray-900">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {city.adminName1 && `${city.adminName1}, `}{city.countryName}
                      </div>
                    </div>
                  ))
                ) : form.destino.length >= 3 ? (
                  <div className="p-3 text-center text-gray-500">
                    Nenhuma cidade encontrada
                  </div>
                ) : null}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Duração (dias)</label>
            <input
              type="number"
              name="duracao"
              min={1}
              max={20}
              value={form.duracao}
              onChange={handleChange}
              required
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-econotrip-blue ${form.duracao > 20 ? 'border-red-500 ring-2 ring-red-400' : ''}`}
              placeholder="Ex: 7"
            />
            {form.duracao > 20 && (
              <p className="text-red-600 text-sm mt-1">A duração máxima permitida é 20 dias.</p>
            )}
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
