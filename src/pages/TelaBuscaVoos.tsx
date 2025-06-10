
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
import { ArrowLeft } from "lucide-react";

export default function TelaBuscaVoos() {
  const navigate = useNavigate();
  const { lastSearch, showRestorePrompt, saveSearch, hideRestorePrompt } = useLastSearch();
  const [preferenciasUsuario, setPreferenciasUsuario] = useState<string[]>([]);
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
    
    // Save search data
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
        className="space-y-4 pb-28"
      >
        {/* Header com botão voltar */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={handleVoltar}
            className="flex-shrink-0"
            aria-label="Voltar"
          />
          <h1 className="text-xl font-semibold text-econotrip-blue">
            Busque seu próximo voo
          </h1>
        </div>

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
        {preferenciasUsuario.length > 0 && (
          <motion.div variants={itemAnimation}>
            <SugestoesPersonalizadas 
              preferencias={preferenciasUsuario}
              onSelectSugestao={handleSelectSugestao}
            />
          </motion.div>
        )}

        <motion.div variants={itemAnimation}>
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos essenciais */}
              <div className="space-y-3">
                <Input
                  label="Origem"
                  name="origem"
                  id="origem"
                  placeholder="De onde você vai partir?"
                  value={formData.origem}
                  onChange={handleChange}
                  className="h-12 rounded-lg px-3"
                  required
                  aria-label="Cidade ou aeroporto de origem"
                />

                <Input
                  label="Destino"
                  name="destino"
                  id="destino"
                  placeholder="Para onde você vai?"
                  value={formData.destino}
                  onChange={handleChange}
                  className="h-12 rounded-lg px-3"
                  required
                  aria-label="Cidade ou aeroporto de destino"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    label="Data de Ida"
                    name="dataIda"
                    id="dataIda"
                    value={formData.dataIda}
                    onChange={handleChange}
                    className="h-12 rounded-lg px-3"
                    required
                    aria-label="Data de ida da viagem"
                  />

                  <Input
                    type="date"
                    label="Data de Volta"
                    name="dataVolta"
                    id="dataVolta"
                    value={formData.dataVolta}
                    onChange={handleChange}
                    className="h-12 rounded-lg px-3"
                    aria-label="Data de volta da viagem (opcional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="passageiros"
                      className="block text-base font-medium text-econotrip-blue"
                    >
                      Passageiros
                    </label>
                    <select
                      id="passageiros"
                      name="passageiros"
                      className="h-12 w-full rounded-lg border border-input bg-background px-3 py-2"
                      value={formData.passageiros}
                      onChange={handleChange}
                      aria-label="Quantidade de passageiros"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "adulto" : "adultos"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="classe"
                      className="block text-base font-medium text-econotrip-blue"
                    >
                      Classe
                    </label>
                    <select
                      id="classe"
                      name="classe"
                      className="h-12 w-full rounded-lg border border-input bg-background px-3 py-2"
                      value={formData.classe}
                      onChange={handleChange}
                      aria-label="Classe da viagem"
                    >
                      <option value="economica">Econômica</option>
                      <option value="premium">Premium</option>
                      <option value="executiva">Executiva</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botão para mostrar opções avançadas */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-center text-econotrip-blue font-medium py-2 border-t border-gray-200"
              >
                {showAdvanced ? "Ocultar opções avançadas" : "Mostrar mais opções"}
              </button>

              {/* Campos avançados (colapsáveis) */}
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-gray-200"
                >
                  <Input
                    type="number"
                    label="Meu orçamento é até (opcional)"
                    name="orcamento"
                    id="orcamento"
                    placeholder="R$ 0,00"
                    value={formData.orcamento}
                    onChange={handleChange}
                    className="h-12 rounded-lg px-3"
                    aria-label="Orçamento máximo para a viagem"
                  />

                  <div className="grid grid-cols-1 gap-2">
                    <Checkbox
                      id="somenteDireto"
                      name="somenteDireto"
                      checked={formData.somenteDireto}
                      onChange={handleChange}
                      label="Somente voos diretos"
                    />

                    <Checkbox
                      id="voosSustentaveis"
                      name="voosSustentaveis"
                      checked={formData.voosSustentaveis}
                      onChange={handleChange}
                      label="Priorizar voos sustentáveis"
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
                </motion.div>
              )}
            </form>
          </Card>
        </motion.div>

        {/* Dicas de economia */}
        <motion.div variants={itemAnimation}>
          <DicasEconomia />
        </motion.div>

        <motion.div variants={itemAnimation}>
          <AlertBox
            type="info"
            title="Dica de Viagem"
          >
            Reservas feitas com antecedência de 60 dias ou mais geralmente têm melhores preços. 
            Considere planejar sua viagem com antecedência para economizar!
          </AlertBox>
        </motion.div>
      </motion.div>
      
      {/* Botão fixo na parte inferior */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-10 bg-gradient-to-t from-white via-white to-transparent pt-4">
        <div className="max-w-screen-sm mx-auto">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full h-14 text-lg rounded-xl shadow-lg"
            onClick={handleSubmit}
          >
            Buscar Voos
          </Button>
        </div>
      </div>
      
      <AssistButton tooltipText="Ajuda com busca de voos" />
    </div>
  );
}
