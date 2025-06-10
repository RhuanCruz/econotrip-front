
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Input } from "@/components/ui-custom/Input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plane, 
  Calendar, 
  Users, 
  MapPin, 
  Search,
  Settings,
  ArrowRight,
  Gift
} from "lucide-react";

import { LastSearchPrompt } from "@/components/search/LastSearchPrompt";
import { DateSelector } from "@/components/search/DateSelector";
import { useLastSearch } from "@/hooks/useLastSearch";
import { ContextualTooltip } from "@/components/ui-custom/ContextualTooltip";
import { MotivationalHint } from "@/components/ui-custom/MotivationalHint";
import { StandardModal } from "@/components/ui-custom/StandardModal";

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

export default function TelaBuscaVoos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lastSearch, showRestorePrompt, saveSearch, hideRestorePrompt } = useLastSearch();

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "info" as const,
    title: "",
    description: ""
  });

  const [formData, setFormData] = useState<FormData>({
    origem: "",
    destino: "",
    dataIda: "",
    dataVolta: "",
    passageiros: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    classe: "economica",
    usarMilhas: false,
    filtros: {
      melhorPreco: true,
      acessibilidade: false,
      sustentavel: false,
      voosDiretos: false,
    },
    orcamento: "",
    somenteDireto: false,
    voosSustentaveis: false,
    tarifasFlexiveis: false,
    acessibilidade: false,
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    const destinoSugerido = location.state?.destinoSugerido;
    if (destinoSugerido) {
      setFormData(prev => ({ ...prev, destino: destinoSugerido }));
    }
  }, [location.state]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePassengerChange = (type: keyof FormData["passageiros"], increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      passageiros: {
        ...prev.passageiros,
        [type]: Math.max(0, prev.passageiros[type] + (increment ? 1 : -1))
      }
    }));
  };

  const handleSearch = () => {
    if (!formData.origem || !formData.destino || !formData.dataIda) {
      setModalConfig({
        type: "warning",
        title: "Informações em falta",
        description: "Por favor, preencha os campos obrigatórios: origem, destino e data de ida para continuar sua busca."
      });
      setShowModal(true);
      return;
    }

    saveSearch(formData);
    
    setModalConfig({
      type: "success",
      title: "Buscando suas opções de viagem",
      description: "Aguarde um momento enquanto encontramos as melhores passagens para você!"
    });
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/resultados-voos", { state: { searchData: formData } });
    }, 2000);
  };

  const handleRestoreLastSearch = () => {
    if (lastSearch) {
      setFormData(lastSearch);
      hideRestorePrompt();
    }
  };

  const getTotalPassengers = () => {
    return formData.passageiros.adults + formData.passageiros.children + formData.passageiros.infants;
  };

  const getPassengerText = () => {
    const total = getTotalPassengers();
    if (total === 1) return "1 passageiro";
    return `${total} passageiros`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <AnimatePresence>
        {showRestorePrompt && lastSearch && (
          <LastSearchPrompt
            lastSearch={lastSearch}
            onRestore={handleRestoreLastSearch}
            onDismiss={hideRestorePrompt}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue mb-2">
            Encontre sua próxima viagem
          </h1>
          <p className="text-lg text-gray-600">
            Informe seus dados abaixo para descobrir as melhores opções de passagens
          </p>
        </div>

        <MotivationalHint message="Você está a poucos cliques de realizar sua próxima aventura!" />

        <Card className="p-6 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origem */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-lg font-medium text-econotrip-blue">
                  <MapPin className="h-5 w-5 inline mr-2" />
                  De onde você vai partir?
                </label>
                <ContextualTooltip content="Digite o nome da cidade ou aeroporto de onde você deseja partir. Exemplo: São Paulo, Rio de Janeiro, Brasília." />
              </div>
              <Input
                type="text"
                value={formData.origem}
                onChange={(e) => handleInputChange("origem", e.target.value)}
                placeholder="São Paulo, Rio de Janeiro..."
                className="h-16 text-lg"
                required
              />
            </div>

            {/* Destino */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-lg font-medium text-econotrip-blue">
                  <Plane className="h-5 w-5 inline mr-2" />
                  Para onde você quer ir?
                </label>
                <ContextualTooltip content="Digite o nome da cidade ou país do seu destino dos sonhos. Exemplo: Lisboa, Paris, Nova York." />
              </div>
              <Input
                type="text"
                value={formData.destino}
                onChange={(e) => handleInputChange("destino", e.target.value)}
                placeholder="Lisboa, Paris, Nova York..."
                className="h-16 text-lg"
                required
              />
            </div>

            {/* Data de Ida */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DateSelector
                  label="Quando você quer viajar?"
                  value={formData.dataIda}
                  onChange={(value) => handleInputChange("dataIda", value)}
                />
                <ContextualTooltip content="Escolha a data que você gostaria de partir. Você pode selecionar datas futuras ou usar as opções rápidas." />
              </div>
            </div>

            {/* Data de Volta */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DateSelector
                  label="Quando você quer voltar? (opcional)"
                  value={formData.dataVolta}
                  onChange={(value) => handleInputChange("dataVolta", value)}
                  minDate={formData.dataIda}
                />
                <ContextualTooltip content="Se você já sabe quando quer voltar, selecione a data. Caso contrário, pode deixar em branco para ver apenas passagens de ida." />
              </div>
            </div>
          </div>

          {/* Passageiros */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <label className="text-lg font-medium text-econotrip-blue">
                <Users className="h-5 w-5 inline mr-2" />
                Quantas pessoas vão viajar?
              </label>
              <ContextualTooltip content="Defina quantos adultos, crianças e bebês farão a viagem. Isso nos ajuda a encontrar as melhores tarifas para seu grupo." />
            </div>
            
            <Card className="p-4 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Adultos</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePassengerChange("adults", false)}
                      disabled={formData.passageiros.adults <= 1}
                      className="w-8 h-8 rounded-full"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{formData.passageiros.adults}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePassengerChange("adults", true)}
                      className="w-8 h-8 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Crianças (2-11 anos)</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePassengerChange("children", false)}
                      disabled={formData.passageiros.children <= 0}
                      className="w-8 h-8 rounded-full"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{formData.passageiros.children}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePassengerChange("children", true)}
                      className="w-8 h-8 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Bebês (até 2 anos)</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePassengerChange("infants", false)}
                      disabled={formData.passageiros.infants <= 0}
                      className="w-8 h-8 rounded-full"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{formData.passageiros.infants}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePassengerChange("infants", true)}
                      className="w-8 h-8 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Milhas */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-lg font-medium text-econotrip-blue">
                  <Gift className="h-5 w-5 inline mr-2" />
                  Deseja usar suas milhas?
                </label>
                <ContextualTooltip content="Se você possui milhas no programa EconoTrip ou de companhias aéreas, pode utilizá-las para reduzir o valor da passagem." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.usarMilhas}
                  onChange={(e) => handleInputChange("usarMilhas", e.target.checked)}
                  className="w-5 h-5 text-econotrip-orange"
                />
                <span className="text-base">Sim, quero usar minhas milhas</span>
              </label>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              icon={Settings}
              className="mb-4"
            >
              {showAdvancedFilters ? "Ocultar" : "Mostrar"} opções avançadas
            </Button>

            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-4 bg-gray-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.filtros.melhorPreco}
                        onChange={(e) => handleInputChange("filtros", {
                          ...formData.filtros,
                          melhorPreco: e.target.checked
                        })}
                        className="w-5 h-5 text-econotrip-orange"
                      />
                      <span className="text-base">Mostrar apenas menores preços</span>
                      <ContextualTooltip content="Exibe primeiro as opções mais econômicas para sua viagem." />
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.filtros.acessibilidade}
                        onChange={(e) => handleInputChange("filtros", {
                          ...formData.filtros,
                          acessibilidade: e.target.checked
                        })}
                        className="w-5 h-5 text-econotrip-orange"
                      />
                      <span className="text-base">Voos com acessibilidade</span>
                      <ContextualTooltip content="Prioriza voos e companhias que oferecem facilidades para pessoas com mobilidade reduzida ou necessidades especiais." />
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.filtros.sustentavel}
                        onChange={(e) => handleInputChange("filtros", {
                          ...formData.filtros,
                          sustentavel: e.target.checked
                        })}
                        className="w-5 h-5 text-econotrip-orange"
                      />
                      <span className="text-base">Voos sustentáveis</span>
                      <ContextualTooltip content="Mostra voos com menor impacto ambiental, usando aeronaves mais eficientes." />
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.filtros.voosDiretos}
                        onChange={(e) => handleInputChange("filtros", {
                          ...formData.filtros,
                          voosDiretos: e.target.checked
                        })}
                        className="w-5 h-5 text-econotrip-orange"
                      />
                      <span className="text-base">Apenas voos diretos</span>
                      <ContextualTooltip content="Exibe somente voos sem conexões, mais rápidos e confortáveis." />
                    </label>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Botão de Busca */}
          <div className="mt-8 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSearch}
              icon={Search}
              iconPosition="right"
              className="w-full md:w-auto bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 text-white text-xl px-12 py-4 h-16 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Buscar passagens
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              Vamos encontrar as melhores opções para sua viagem!
            </p>
          </div>
        </Card>
      </motion.div>

      <StandardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText="Entendi"
      />
    </div>
  );
}
