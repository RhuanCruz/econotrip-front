
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Glasses, Type, Contrast, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccessibilitySettings {
  largeFonts: boolean;
  highContrast: boolean;
}

export function AccessibilityBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    largeFonts: false,
    highContrast: false,
  });

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem("econotrip_accessibility");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applySettings(parsed);
      } catch (error) {
        console.log("Erro ao carregar configurações de acessibilidade:", error);
      }
    }
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    const html = document.documentElement;
    
    // Large fonts
    if (newSettings.largeFonts) {
      html.classList.add("accessibility-large-fonts");
    } else {
      html.classList.remove("accessibility-large-fonts");
    }
    
    // High contrast
    if (newSettings.highContrast) {
      html.classList.add("accessibility-high-contrast");
    } else {
      html.classList.remove("accessibility-high-contrast");
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    applySettings(newSettings);
    
    try {
      localStorage.setItem("econotrip_accessibility", JSON.stringify(newSettings));
    } catch (error) {
      console.log("Erro ao salvar configurações:", error);
    }
  };

  return (
    <>
      {/* Fixed button - posicionado acima da navegação */}
      <div className="fixed bottom-28 left-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full bg-econotrip-green shadow-lg flex items-center justify-center text-white hover:bg-econotrip-green/90 transition-colors touch-target"
          aria-label="Abrir opções de acessibilidade"
        >
          <Glasses className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Painel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsExpanded(false);
              }
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6 rounded-t-2xl shadow-2xl bg-white">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-econotrip-green/10 rounded-lg">
                      <Glasses className="h-6 w-6 text-econotrip-green" aria-hidden="true" />
                    </div>
                    <h2 id="accessibility-title" className="text-xl font-semibold text-econotrip-blue">
                      Acessibilidade
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
                    aria-label="Fechar opções de acessibilidade"
                  >
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Type className="h-5 w-5 text-econotrip-blue" aria-hidden="true" />
                      <div>
                        <h3 className="font-medium text-econotrip-blue">Fonte Grande</h3>
                        <p className="text-sm text-gray-600">Aumenta o tamanho do texto</p>
                      </div>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.largeFonts}
                        onChange={() => updateSetting("largeFonts")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        settings.largeFonts 
                          ? "bg-econotrip-green border-econotrip-green" 
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}>
                        {settings.largeFonts && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Contrast className="h-5 w-5 text-econotrip-blue" aria-hidden="true" />
                      <div>
                        <h3 className="font-medium text-econotrip-blue">Alto Contraste</h3>
                        <p className="text-sm text-gray-600">Melhora a legibilidade</p>
                      </div>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={() => updateSetting("highContrast")}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        settings.highContrast 
                          ? "bg-econotrip-green border-econotrip-green" 
                          : "bg-white border-gray-300 hover:border-gray-400"
                      }`}>
                        {settings.highContrast && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Suas preferências são salvas automaticamente
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
