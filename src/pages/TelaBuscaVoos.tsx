
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui-custom/Input";
import { Button } from "@/components/ui-custom/Button";
import { Checkbox } from "@/components/ui-custom/Checkbox";
import { Card } from "@/components/ui-custom/Card";
import { AlertBox } from "@/components/ui-custom/AlertBox";
import { motion, AnimatePresence } from "framer-motion";
import { AssistButton } from "@/components/ui-custom/AssistButton";
import { LastSearchPrompt } from "@/components/search/LastSearchPrompt";
import { DicasEconomia } from "@/components/financial/DicasEconomia";
import { SugestoesPersonalizadas } from "@/components/suggestions/SugestoesPersonalizadas";
import { useLastSearch } from "@/hooks/useLastSearch";
import { ArrowLeft, MapPin, Calendar, Users, Settings, Lightbulb } from "lucide-react";

export default function TelaBuscaVoos() {
  const navigate = useNavigate();
  const { lastSearch, showRestorePrompt, saveSearch, hideRestorePrompt } = useLastSearch();
  const [preferenciasUsuario, setPreferenciasUsuario] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    dataIda: "",
    dataVolta: "",
    passageiros: "1",
    classe: "economica",
    orcamento: "",
    somenteDireto: false,
    voosSustentaveis: false,
    tarifasFlexiveis: false,
    acessibilidade: false,
  });

  useEffect(() => {
    const perfilSalvo = localStorage.getItem("econotrip_perfil_viajante");
    if (perfilSalvo) {
      const perfil = JSON.parse(perfilSalvo);
      setPreferenciasUsuario(perfil.preferencias || []);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da busca:", formData);
    saveSearch(formData);
    navigate("/resultados-voos");
  };

  const handleRestoreSearch = () => {
    if (lastSearch) {
      setFormData(lastSearch);
      hideRestorePrompt();
    }
  };

  const handleSelectSugestao = (sugestao: any) => {
    navigate("/roteiros-personalizados");
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const stepProgress = (currentStep / 3) * 100;

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
    <div className="max-w-screen-sm mx-auto px-4 py-4">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
        className="space-y-6 pb-28"
      >
        {/* Header modernizado */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={handleVoltar}
            className="flex-shrink-0"
            aria-label="Voltar"
          />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-econotrip-blue">
              Encontre seu voo ideal
            </h1>
            <p className="text-sm text-gray-600">
              Passo {currentStep} de 3 - {currentStep === 1 ? "Destino" : currentStep === 2 ? "Datas" : "Preferências"}
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <motion.div
          variants={itemAnimation}
          className="w-full bg-gray-200 rounded-full h-2"
        >
          <motion.div
            className="bg-econotrip-orange h-2 rounded-full transition-all duration-500"
            initial={{ width: "33%" }}
            animate={{ width: `${stepProgress}%` }}
          />
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

        {/* Sugestões personalizadas */}
        {preferenciasUsuario.length > 0 && currentStep === 1 && (
          <motion.div variants={itemAnimation}>
            <SugestoesPersonalizadas 
              preferencias={preferenciasUsuario}
              onSelectSugestao={handleSelectSugestao}
            />
          </motion.div>
        )}

        {/* Formulário por etapas */}
        <motion.div variants={itemAnimation}>
          <Card className="p-6 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Etapa 1: Origem e Destino */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <MapPin className="h-8 w-8 text-econotrip-orange mx-auto mb-2" />
                      <h2 className="text-lg font-medium text-econotrip-blue">
                        Para onde vamos?
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="De onde você vai partir?"
                        name="origem"
                        id="origem"
                        placeholder="São Paulo, SP"
                        value={formData.origem}
                        onChange={handleChange}
                        className="h-14 text-lg rounded-xl"
                        required
                      />

                      <Input
                        label="Para onde você quer ir?"
                        name="destino"
                        id="destino"
                        placeholder="Rio de Janeiro, RJ"
                        value={formData.destino}
                        onChange={handleChange}
                        className="h-14 text-lg rounded-xl"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Etapa 2: Datas e Passageiros */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <Calendar className="h-8 w-8 text-econotrip-orange mx-auto mb-2" />
                      <h2 className="text-lg font-medium text-econotrip-blue">
                        Quando você quer viajar?
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="date"
                          label="Ida"
                          name="dataIda"
                          id="dataIda"
                          value={formData.dataIda}
                          onChange={handleChange}
                          className="h-14 rounded-xl"
                          required
                        />

                        <Input
                          type="date"
                          label="Volta"
                          name="dataVolta"
                          id="dataVolta"
                          value={formData.dataVolta}
                          onChange={handleChange}
                          className="h-14 rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-base font-medium text-econotrip-blue">
                            <Users className="h-4 w-4 inline mr-2" />
                            Passageiros
                          </label>
                          <select
                            name="passageiros"
                            className="h-14 w-full rounded-xl border border-input bg-background px-4 text-lg"
                            value={formData.passageiros}
                            onChange={handleChange}
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "pessoa" : "pessoas"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-base font-medium text-econotrip-blue">
                            Classe
                          </label>
                          <select
                            name="classe"
                            className="h-14 w-full rounded-xl border border-input bg-background px-4 text-lg"
                            value={formData.classe}
                            onChange={handleChange}
                          >
                            <option value="economica">Econômica</option>
                            <option value="premium">Premium</option>
                            <option value="executiva">Executiva</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Etapa 3: Preferências */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <Settings className="h-8 w-8 text-econotrip-orange mx-auto mb-2" />
                      <h2 className="text-lg font-medium text-econotrip-blue">
                        Suas preferências
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <Input
                        type="number"
                        label="Orçamento máximo (opcional)"
                        name="orcamento"
                        id="orcamento"
                        placeholder="R$ 1.000"
                        value={formData.orcamento}
                        onChange={handleChange}
                        className="h-14 text-lg rounded-xl"
                      />

                      <div className="space-y-3">
                        <Checkbox
                          id="somenteDireto"
                          name="somenteDireto"
                          checked={formData.somenteDireto}
                          onChange={handleChange}
                          label="Apenas voos diretos"
                        />

                        <Checkbox
                          id="voosSustentaveis"
                          name="voosSustentaveis"
                          checked={formData.voosSustentaveis}
                          onChange={handleChange}
                          label="Preferir voos sustentáveis"
                        />

                        <Checkbox
                          id="tarifasFlexiveis"
                          name="tarifasFlexiveis"
                          checked={formData.tarifasFlexiveis}
                          onChange={handleChange}
                          label="Tarifas flexíveis"
                        />

                        <Checkbox
                          id="acessibilidade"
                          name="acessibilidade"
                          checked={formData.acessibilidade}
                          onChange={handleChange}
                          label="Preciso de assistência especial"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navegação entre etapas */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6"
                >
                  Anterior
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!formData.origem || !formData.destino)) ||
                      (currentStep === 2 && !formData.dataIda)
                    }
                    className="px-6"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-8"
                  >
                    Buscar Voos
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Dicas contextuais */}
        {currentStep === 1 && (
          <motion.div variants={itemAnimation}>
            <Card className="p-4 bg-gradient-to-r from-econotrip-blue/5 to-econotrip-orange/5 rounded-2xl">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-econotrip-orange mt-0.5" />
                <div>
                  <h4 className="font-medium text-econotrip-blue text-sm">Dica</h4>
                  <p className="text-xs text-gray-600">
                    Use códigos de aeroporto (GRU, SDU) para resultados mais precisos
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Dicas de economia */}
        <motion.div variants={itemAnimation}>
          <DicasEconomia />
        </motion.div>
      </motion.div>
      
      <AssistButton tooltipText="Ajuda com busca de voos" />
    </div>
  );
}
