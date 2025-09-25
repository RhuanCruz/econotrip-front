
import React, { useState } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Headphones, Phone, MessageCircle, Mail, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function HumanSupportButton() {
  const [showOptions, setShowOptions] = useState(false);
  const location = useLocation();
  
  // Show on critical pages
  const criticalRoutes = ["/resultados-voos", "/checkout", "/confirmacao"];
  const shouldShow = criticalRoutes.some(route => location.pathname.startsWith(route));
  
  if (!shouldShow) return null;

  const handleCall = () => {
    window.location.href = "tel:08001234567";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/5511999999999", "_blank");
  };

  const handleEmail = () => {
    window.location.href = "mailto:ajuda@econotrip.com.br";
  };

  return (
    <>
      <div className="fixed bottom-32 right-4 z-40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOptions(true)}
                className="h-12 w-12 rounded-full bg-econotrip-orange shadow-lg flex items-center justify-center text-white hover:bg-econotrip-orange/90 transition-colors touch-target"
                aria-label="Precisa falar com alguém?"
              >
                <Headphones className="h-6 w-6" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-sm font-medium">Precisa falar com alguém?</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm"
            >
              <Card className="p-6 rounded-2xl shadow-2xl bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 id="support-title" className="text-base font-semibold text-econotrip-blue">
                    Fale Conosco
                  </h2>
                  <button
                    onClick={() => setShowOptions(false)}
                    className="p-2 rounded-full hover:bg-gray-100 touch-target"
                    aria-label="Fechar opções de contato"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={MessageCircle}
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700"
                    aria-label="Conversar pelo WhatsApp"
                  >
                    WhatsApp
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    icon={Mail}
                    onClick={handleEmail}
                    className="w-full"
                    aria-label="Enviar email"
                  >
                    Email
                  </Button>
                </div>

                <p className="text-sm text-center text-gray-600 mt-4">
                  Atendimento das 8h às 18h, todos os dias
                </p>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
