
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion } from "framer-motion";
import { 
  Plane, 
  Heart, 
  Leaf, 
  ArrowRight,
  Users,
  Shield,
  Sparkles
} from "lucide-react";

export default function TelaBoasVindas() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Fácil de Usar",
      description: "Interface pensada especialmente para você, com navegação simplificada e intuitiva.",
      color: "from-econotrip-blue to-blue-400"
    },
    {
      icon: Heart,
      title: "Economia Inteligente",
      description: "Encontre as melhores tarifas e promoções para seus destinos favoritos.",
      color: "from-econotrip-orange to-orange-400"
    },
    {
      icon: Leaf,
      title: "Sustentabilidade",
      description: "Opções de voos com menor impacto ambiental para um turismo mais responsável.",
      color: "from-econotrip-green to-green-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Logo e título principal */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png" 
                  alt="EconoTrip"
                  className="h-16 w-16 md:h-20 md:w-20 rounded-2xl shadow-lg"
                />
                <div className="text-left">
                  <h1 className="text-3xl md:text-5xl font-museomoderno font-bold text-econotrip-blue">
                    ECONOTRIP
                  </h1>
                  <p className="text-econotrip-orange font-medium text-lg md:text-xl">
                    PrimeVoyage
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
              Viagens aéreas simples, acessíveis e sustentáveis
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubra destinos incríveis com as melhores tarifas e uma experiência pensada especialmente para você
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                icon={ArrowRight}
                iconPosition="right"
                className="text-xl px-8 py-4 h-16 bg-gradient-to-r from-econotrip-orange to-econotrip-orange/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Começar sua jornada
              </Button>
            </motion.div>
          </motion.div>

          {/* Cards de recursos redesenhados */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="p-6 md:p-8 text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-econotrip-blue mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to action secundário */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mt-12"
          >
            <div className="flex items-center justify-center gap-2 text-econotrip-blue mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Já tem uma conta?</span>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => navigate("/login")}
              className="text-lg px-6 py-3"
            >
              Fazer login
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer redesenhado */}
      <footer className="bg-white/95 backdrop-blur-md border-t border-gray-200 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <img 
                  src="/lovable-uploads/b8633032-8de9-42de-8fdf-b32ea404bcd9.png" 
                  alt="EconoTrip"
                  className="h-8 w-8 rounded-lg"
                />
                <div className="font-museomoderno font-bold text-lg text-econotrip-blue">
                  ECONOTRIP
                </div>
                <span className="text-econotrip-orange font-medium text-sm">
                  PrimeVoyage
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} ECONOTRIP. Todos os direitos reservados.
              </p>
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => document.body.classList.toggle("high-contrast")}
              icon={Shield}
              className="text-sm"
              aria-label="Alternar modo de alto contraste"
            >
              Alto Contraste
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
