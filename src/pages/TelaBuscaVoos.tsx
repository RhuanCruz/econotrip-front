import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";

import { ModernFlightSearchForm } from "@/components/search/ModernFlightSearchForm";
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

  const formRef = useRef<{ getOrigemBusca?: () => string; getDestinoBusca?: () => string } | null>(null);

  useEffect(() => {
    const destinoSugerido = location.state?.destinoSugerido;
    if (destinoSugerido) {
      setFormData(prev => ({ ...prev, destino: destinoSugerido }));
    }
  }, [location.state]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | FormData["passageiros"] | FormData["filtros"]) => {
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

    setModalConfig({
      type: "success",
      title: "Buscando suas opções de viagem",
      description: "Aguarde um momento enquanto encontramos as melhores passagens para você!"
    });
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      // Busca os códigos corretos via ref
      const origemCode = formRef.current?.getOrigemBusca?.() || formData.origem;
      const destinoCode = formRef.current?.getDestinoBusca?.() || formData.destino;
      const searchData = { ...formData, origem: origemCode, destino: destinoCode };
      
      // Se estiver usando milhas, vai para a tela de programas de milhas
      if (formData.usarMilhas) {
        navigate("/programas-milhas", {
          state: {
            origem: origemCode,
            destino: destinoCode,
            dataIda: formData.dataIda,
            dataVolta: formData.dataVolta,
            searchData
          }
        });
      } else {
        // Fluxo normal para busca em dinheiro
        if (formData.dataVolta) {
          navigate("/resultados-ida-volta", { state: { searchData } });
        } else {
          navigate("/resultados-voos", { state: { searchData } });
        }
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center pt-8 pb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-econotrip-blue to-econotrip-orange rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Plane className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-museomoderno font-bold text-econotrip-blue mb-3 text-balance"
            >
              Buscar Voos
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 text-balance"
            >
              Para onde vamos viajar hoje?
            </motion.p>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-econotrip-blue">200+</div>
              <div className="text-sm text-gray-600">Destinos</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-econotrip-orange">24/7</div>
              <div className="text-sm text-gray-600">Suporte</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-econotrip-green">95%</div>
              <div className="text-sm text-gray-600">Satisfação</div>
            </div>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ModernFlightSearchForm
              ref={formRef}
              formData={formData}
              onInputChange={handleInputChange}
              onPassengerChange={handlePassengerChange}
              onSearch={handleSearch}
            />
          </motion.div>
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
    </div>
  );
}
