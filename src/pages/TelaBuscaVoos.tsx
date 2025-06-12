
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { LastSearchPrompt } from "@/components/search/LastSearchPrompt";
import { FlightSearchForm } from "@/components/search/FlightSearchForm";
import { useLastSearch } from "@/hooks/useLastSearch";
import { MotivationalHint } from "@/components/ui-custom/MotivationalHint";
import { StandardModal, ModalType } from "@/components/ui-custom/StandardModal";

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
    type: "info" as ModalType,
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
      const restoredData: FormData = {
        origem: lastSearch.origem,
        destino: lastSearch.destino,
        dataIda: lastSearch.dataIda,
        dataVolta: lastSearch.dataVolta,
        passageiros: lastSearch.passageiros,
        classe: lastSearch.classe,
        usarMilhas: lastSearch.usarMilhas,
        filtros: lastSearch.filtros,
        orcamento: "",
        somenteDireto: false,
        voosSustentaveis: false,
        tarifasFlexiveis: false,
        acessibilidade: false,
      };
      setFormData(restoredData);
      hideRestorePrompt();
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 pb-24">
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
        className="space-y-8"
      >
        <div className="text-center py-6">
          <h1 className="text-3xl font-museomoderno font-bold text-econotrip-blue mb-3 text-balance">
            Encontre sua próxima viagem
          </h1>
          <p className="text-lg text-gray-600 text-balance">
            Informe seus dados abaixo para descobrir as melhores opções de passagens
          </p>
        </div>

        <MotivationalHint message="Você está a poucos cliques de realizar sua próxima aventura!" />

        <FlightSearchForm
          formData={formData}
          onInputChange={handleInputChange}
          onPassengerChange={handlePassengerChange}
          onSearch={handleSearch}
        />
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
