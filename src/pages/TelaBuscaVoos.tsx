
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutBase } from "@/components/layout/LayoutBase";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plane, 
  Filter,
  Star,
  ArrowLeftRight,
  Lightbulb,
  CreditCard
} from "lucide-react";
import { AutocompleteInput } from "@/components/search/AutocompleteInput";
import { DateSelector } from "@/components/search/DateSelector";
import { PassengerSelector } from "@/components/search/PassengerSelector";
import { SustainableBadge } from "@/components/sustainable/SustainableBadge";
import { Checkbox } from "@/components/ui-custom/Checkbox";
import { useLastSearch } from "@/hooks/useLastSearch";
import { LastSearchPrompt } from "@/components/search/LastSearchPrompt";
import { toast } from "@/hooks/use-toast";

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
}

export default function TelaBuscaVoos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lastSearch, showRestorePrompt, saveSearch, hideRestorePrompt } = useLastSearch();
  
  const [formData, setFormData] = useState<FormData>({
    origem: "",
    destino: "",
    dataIda: "",
    dataVolta: "",
    passageiros: { adults: 1, children: 0, infants: 0 },
    classe: "economica",
    usarMilhas: false,
    filtros: {
      melhorPreco: false,
      acessibilidade: false,
      sustentavel: false,
      voosDiretos: false,
    },
  });

  const [showFiltros, setShowFiltros] = useState(false);

  // Pré-preencher com dados da oferta se vier do RadarOfertas
  useEffect(() => {
    if (location.state) {
      const { origem, destino, sustentavel } = location.state;
      if (origem) setFormData(prev => ({ ...prev, origem }));
      if (destino) setFormData(prev => ({ ...prev, destino }));
      if (sustentavel) {
        setFormData(prev => ({
          ...prev,
          filtros: { ...prev.filtros, sustentavel: true }
        }));
      }
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.origem || !formData.destino) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha origem e destino.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dataIda) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione a data de ida.",
        variant: "destructive",
      });
      return;
    }

    console.log("Dados da busca:", formData);
    saveSearch(formData);
    
    toast({
      title: "Buscando voos...",
      description: "Encontrando as melhores opções para você.",
    });

    navigate("/resultados-voos");
  };

  const handleTrocarOrigemDestino = () => {
    setFormData(prev => ({
      ...prev,
      origem: prev.destino,
      destino: prev.origem,
    }));
  };

  const handleRestoreSearch = () => {
    if (lastSearch) {
      setFormData(lastSearch);
      hideRestorePrompt();
    }
  };

  const handleFilterChange = (filtro: keyof FormData['filtros']) => {
    setFormData(prev => ({
      ...prev,
      filtros: {
        ...prev.filtros,
        [filtro]: !prev.filtros[filtro]
      }
    }));
  };

  return (
    <LayoutBase>
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-econotrip-orange/10 rounded-2xl">
              <Search className="h-8 w-8 text-econotrip-orange" />
            </div>
            <h1 className="text-2xl font-bold text-econotrip-blue">
              Buscar Voos
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Encontre as melhores ofertas
          </p>
        </motion.div>

        {/* Last search prompt */}
        <AnimatePresence>
          {showRestorePrompt && lastSearch && (
            <LastSearchPrompt
              lastSearch={lastSearch}
              onRestore={handleRestoreSearch}
              onDismiss={hideRestorePrompt}
            />
          )}
        </AnimatePresence>

        {/* Tabs para tipo de busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex bg-gray-100 rounded-2xl p-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, usarMilhas: false }))}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all text-lg ${
                !formData.usarMilhas
                  ? "bg-white text-econotrip-blue shadow-md"
                  : "text-gray-600"
              }`}
              aria-pressed={!formData.usarMilhas}
            >
              <Plane className="h-5 w-5 mx-auto mb-1" />
              Buscar com dinheiro
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, usarMilhas: true }))}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all text-lg ${
                formData.usarMilhas
                  ? "bg-white text-econotrip-blue shadow-md"
                  : "text-gray-600"
              }`}
              aria-pressed={formData.usarMilhas}
            >
              <Star className="h-5 w-5 mx-auto mb-1" />
              Buscar com milhas
            </button>
          </div>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 shadow-lg rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Origem e Destino */}
              <div className="space-y-4">
                <div className="relative">
                  <AutocompleteInput
                    label="De onde você sai?"
                    placeholder="São Paulo, SP"
                    value={formData.origem}
                    onChange={(value) => setFormData(prev => ({ ...prev, origem: value }))}
                    options={[]}
                  />
                  
                  {/* Botão para trocar origem/destino */}
                  <button
                    type="button"
                    onClick={handleTrocarOrigemDestino}
                    className="absolute right-4 top-16 z-10 p-2 bg-white border-2 border-econotrip-orange rounded-full hover:bg-econotrip-orange hover:text-white transition-all shadow-md"
                    aria-label="Trocar origem e destino"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </button>
                </div>

                <AutocompleteInput
                  label="Para onde você vai?"
                  placeholder="Rio de Janeiro, RJ"
                  value={formData.destino}
                  onChange={(value) => setFormData(prev => ({ ...prev, destino: value }))}
                  options={[]}
                />
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateSelector
                  label="Data de ida"
                  value={formData.dataIda}
                  onChange={(value) => setFormData(prev => ({ ...prev, dataIda: value }))}
                />
                <DateSelector
                  label="Data de volta (opcional)"
                  value={formData.dataVolta}
                  onChange={(value) => setFormData(prev => ({ ...prev, dataVolta: value }))}
                  minDate={formData.dataIda}
                />
              </div>

              {/* Passageiros e Classe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PassengerSelector
                  value={formData.passageiros}
                  onChange={(value) => setFormData(prev => ({ ...prev, passageiros: value }))}
                />
                
                <div>
                  <label className="block text-lg font-medium text-econotrip-blue mb-3">
                    <CreditCard className="h-5 w-5 inline mr-2" />
                    Classe
                  </label>
                  <select
                    value={formData.classe}
                    onChange={(e) => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                    className="w-full h-16 rounded-xl border border-gray-300 px-4 text-lg focus:ring-2 focus:ring-econotrip-orange focus:border-transparent"
                  >
                    <option value="economica">Econômica</option>
                    <option value="premium">Premium</option>
                    <option value="executiva">Executiva</option>
                    <option value="primeira">Primeira Classe</option>
                  </select>
                </div>
              </div>

              {/* Filtros */}
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowFiltros(!showFiltros)}
                  className="w-full h-12 justify-between"
                  icon={Filter}
                >
                  Filtros avançados
                  <motion.div
                    animate={{ rotate: showFiltros ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Filter className="h-5 w-5" />
                  </motion.div>
                </Button>

                <AnimatePresence>
                  {showFiltros && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4"
                    >
                      <Checkbox
                        id="melhorPreco"
                        checked={formData.filtros.melhorPreco}
                        onChange={() => handleFilterChange("melhorPreco")}
                        label="Priorizar melhor preço"
                      />
                      <Checkbox
                        id="acessibilidade"
                        checked={formData.filtros.acessibilidade}
                        onChange={() => handleFilterChange("acessibilidade")}
                        label="Voos com acessibilidade"
                      />
                      <Checkbox
                        id="sustentavel"
                        checked={formData.filtros.sustentavel}
                        onChange={() => handleFilterChange("sustentavel")}
                        label="Voos sustentáveis (menor emissão)"
                      />
                      <Checkbox
                        id="voosDiretos"
                        checked={formData.filtros.voosDiretos}
                        onChange={() => handleFilterChange("voosDiretos")}
                        label="Apenas voos diretos"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botão de busca */}
              <Button
                type="submit"
                variant="primary"
                className="w-full h-16 text-xl bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 shadow-lg hover:shadow-xl"
                icon={Search}
              >
                Buscar Voos
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Dica contextual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="p-4 bg-gradient-to-r from-econotrip-blue/5 to-econotrip-orange/5">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-econotrip-orange mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-econotrip-blue text-lg mb-1">
                  Dica EconoTrip
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {formData.usarMilhas 
                    ? "Use suas milhas nos voos mais caros para maximizar o valor. Voos para Europa rendem mais!"
                    : "Voos nas terças e quartas são até 30% mais baratos. Considere viajar nesses dias!"
                  }
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </LayoutBase>
  );
}
