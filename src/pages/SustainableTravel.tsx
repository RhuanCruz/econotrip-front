
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { Leaf, Heart, Users, ArrowLeft, Plane } from "lucide-react";
import { motion } from "framer-motion";

export default function SustainableTravel() {
  const navigate = useNavigate();

  const packages = [
    {
      title: "Amazônia Responsável",
      description: "Conheça a floresta com guias locais e hospedagem sustentável",
      price: "R$ 1.890",
      duration: "5 dias",
      impact: "Apoia 3 comunidades ribeirinhas"
    },
    {
      title: "Pantanal Consciente",
      description: "Observação da fauna com práticas de turismo regenerativo",
      price: "R$ 2.340",
      duration: "4 dias",
      impact: "Preserva 50 hectares de habitat"
    },
    {
      title: "Chapada Sustentável",
      description: "Trilhas ecológicas com apoio à economia local",
      price: "R$ 1.290",
      duration: "3 dias",
      impact: "Beneficia 15 famílias locais"
    }
  ];

  const tips = [
    "Prefira voos diretos para reduzir emissões",
    "Escolha hospedagens com certificação ambiental",
    "Consuma produtos locais e artesanatos regionais",
    "Respeite a cultura e tradições dos destinos",
    "Use transporte público ou bicicletas no destino"
  ];

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
    <div className="max-w-4xl mx-auto pb-24">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemAnimation} className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 touch-target"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-6 w-6 text-econotrip-blue" />
          </button>
          <Leaf className="h-8 w-8 text-econotrip-green" aria-hidden="true" />
          <h1 className="text-2xl md:text-3xl font-museomoderno font-bold text-econotrip-blue">
            Viagens que Transformam
          </h1>
        </motion.div>

        {/* Introduction */}
        <motion.div variants={itemAnimation} className="mb-8">
          <Card className="p-6 rounded-2xl bg-econotrip-green/5 border-econotrip-green/20">
            <p className="text-lg text-econotrip-blue leading-relaxed">
              Descubra experiências autênticas que cuidam do planeta e fortalecem as comunidades locais. 
              Cada viagem é uma oportunidade de fazer a diferença.
            </p>
          </Card>
        </motion.div>

        {/* Sustainable Packages */}
        <motion.div variants={itemAnimation} className="mb-12">
          <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-6">
            Pacotes Sustentáveis em Destaque
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                variants={itemAnimation}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-econotrip-green/10 flex items-center justify-center flex-shrink-0">
                      <Leaf className="h-6 w-6 text-econotrip-green" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-econotrip-blue mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{pkg.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duração:</span>
                      <span className="text-sm font-medium">{pkg.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">A partir de:</span>
                      <span className="text-lg font-bold text-econotrip-orange">{pkg.price}</span>
                    </div>
                  </div>
                  
                  <div className="bg-econotrip-green/5 p-3 rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-econotrip-green" aria-hidden="true" />
                      <span className="text-sm font-medium text-econotrip-green">
                        {pkg.impact}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    aria-label={`Saber mais sobre ${pkg.title}`}
                  >
                    Saber mais
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div variants={itemAnimation} className="mb-12">
          <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-6">
            Dicas para Viagens Responsáveis
          </h2>
          
          <Card className="p-6 rounded-2xl">
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  variants={itemAnimation}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-econotrip-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Leaf className="h-3 w-3 text-econotrip-green" aria-hidden="true" />
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemAnimation} className="text-center">
          <Card className="p-8 rounded-2xl bg-gradient-to-r from-econotrip-blue/5 to-econotrip-green/5">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-8 w-8 text-econotrip-blue" aria-hidden="true" />
              <h2 className="text-xl font-museomoderno font-bold text-econotrip-blue">
                Junte-se ao Movimento
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Cada viagem sustentável contribui para um futuro melhor. 
              Faça parte da mudança e viaje com propósito.
            </p>
            
            <Button
              variant="primary"
              size="lg"
              icon={Plane}
              onClick={() => navigate("/busca-voos")}
              className="bg-gradient-to-r from-econotrip-orange to-[#FDCB6E]"
              aria-label="Buscar voos sustentáveis"
            >
              Buscar Voos Sustentáveis
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
