
import React, { useState, useEffect } from "react";
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Glasses, Type, Contrast, X, ChevronDown, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccessibilitySettings {
  largeFonts: boolean;
  highContrast: boolean;
  voiceReading: boolean;
}

export function AccessibilityBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    largeFonts: false,
    highContrast: false,
    voiceReading: false,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Speech synthesis functions (Web + Capacitor TTS)
  const isNativePlatform = Capacitor.isNativePlatform();

  const speakText = async (text: string, shouldDeactivateAfter = false) => {
    setIsSpeaking(true);
    if (isNativePlatform) {
      // Mobile (Android/iOS)
      try {
        await TextToSpeech.speak({
          text,
          lang: 'pt-BR',
          rate: 0.8,
          pitch: 1,
          volume: 1,
          category: 'ambient',
        });
        setIsSpeaking(false);
        if (shouldDeactivateAfter) {
          // Desativa voiceReading após leitura
          const newSettings = { ...settings, voiceReading: false };
          setSettings(newSettings);
          applySettings(newSettings);
          try {
            localStorage.setItem("econotrip_accessibility", JSON.stringify(newSettings));
          } catch (error) {
            console.log("Erro ao salvar configurações:", error);
          }
        }
      } catch (error) {
        setIsSpeaking(false);
        if (shouldDeactivateAfter) {
          const newSettings = { ...settings, voiceReading: false };
          setSettings(newSettings);
          applySettings(newSettings);
          try {
            localStorage.setItem("econotrip_accessibility", JSON.stringify(newSettings));
          } catch (error) {
            console.log("Erro ao salvar configurações:", error);
          }
        }
      }
    } else {
      // Web
      if (!('speechSynthesis' in window)) {
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (shouldDeactivateAfter) {
          // Desativa voiceReading após leitura
          const newSettings = { ...settings, voiceReading: false };
          setSettings(newSettings);
          applySettings(newSettings);
          try {
            localStorage.setItem("econotrip_accessibility", JSON.stringify(newSettings));
          } catch (error) {
            console.log("Erro ao salvar configurações:", error);
          }
        }
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (shouldDeactivateAfter) {
          const newSettings = { ...settings, voiceReading: false };
          setSettings(newSettings);
          applySettings(newSettings);
          try {
            localStorage.setItem("econotrip_accessibility", JSON.stringify(newSettings));
          } catch (error) {
            console.log("Erro ao salvar configurações:", error);
          }
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = async () => {
    if (isNativePlatform) {
      try {
        await TextToSpeech.stop();
      } catch {
        console.log('Failed to stop speech')
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    setIsSpeaking(false);
  };

  // Get page summary based on current page content
  const getPageSummary = () => {
    const pathname = window.location.pathname;
    const pageTitle = document.title;
    
    // Get main headings and content
    const mainHeading = document.querySelector('h1, h2')?.textContent || '';
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Page-specific summaries
    if (pathname === '/' || pathname === '/home') {
      return `Bem-vindo ao EconoTrip. ${pageTitle}. ${mainHeading}. Esta é a página principal onde você pode buscar voos econômicos e planejar suas viagens.`;
    }
    
    if (pathname.includes('/search') || pathname.includes('/buscar')) {
      const searchResults = document.querySelectorAll('[data-testid="flight-result"], .flight-card, .search-result');
      return `Página de busca de voos. ${mainHeading}. ${searchResults.length > 0 ? `Encontrados ${searchResults.length} resultados de voos.` : 'Digite seu destino e datas para buscar voos.'} Use os filtros para refinar sua busca.`;
    }
    
    if (pathname.includes('/profile') || pathname.includes('/perfil')) {
      return `Página do seu perfil. ${mainHeading}. Aqui você pode gerenciar suas informações pessoais, preferências de viagem e histórico de buscas.`;
    }
    
    if (pathname.includes('/radar') || pathname.includes('/alertas')) {
      const radars = document.querySelectorAll('[data-testid="radar-item"], .radar-card');
      return `Página de alertas de preços. ${mainHeading}. ${radars.length > 0 ? `Você tem ${radars.length} alertas ativos.` : 'Crie alertas para ser notificado quando os preços dos voos baixarem.'} Configure seus radares de preços aqui.`;
    }
    
    if (pathname.includes('/simulation') || pathname.includes('/simulacao')) {
      return `Página de simulações de viagem. ${mainHeading}. Aqui você pode criar simulações de viagens e comparar diferentes opções de destinos e datas.`;
    }
    
    if (pathname.includes('/roteiro') || pathname.includes('/itinerary')) {
      return `Página de roteiros de viagem. ${mainHeading}. Gerencie seus roteiros e planeje suas viagens detalhadamente.`;
    }
    
    // Generic fallback
    const firstParagraph = document.querySelector('p')?.textContent?.substring(0, 150) || '';
    return `${pageTitle}. ${mainHeading}. ${metaDescription || firstParagraph}`.replace(/\s+/g, ' ').trim();
  };

  // Global event listener for page summaries
  useEffect(() => {
    const handlePageSummaryRequest = (event: CustomEvent) => {
      if (settings.voiceReading && event.detail.summary) {
        speakText(event.detail.summary);
      }
    };

    window.addEventListener('requestPageSummary', handlePageSummaryRequest as EventListener);
    
    return () => {
      window.removeEventListener('requestPageSummary', handlePageSummaryRequest as EventListener);
    };
  }, [settings.voiceReading]);

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
    
    // Voice reading mode
    if (newSettings.voiceReading) {
      html.classList.add("accessibility-voice-reading");
      // Trigger page summary reading when enabled
      setTimeout(() => {
        const event = new CustomEvent('requestPageSummary', { 
          detail: { summary: getPageSummary() } 
        });
        window.dispatchEvent(event);
      }, 500);
    } else {
      html.classList.remove("accessibility-voice-reading");
      stopSpeech();
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
              <Card className="p-6 rounded-t-2xl shadow-2xl bg-white max-h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
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
                  <button
                    onClick={() => updateSetting("largeFonts")}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-transparent ${
                      settings.largeFonts
                        ? 'border-econotrip-green bg-econotrip-green/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={settings.largeFonts}
                    aria-label={settings.largeFonts ? 'Desativar fonte grande' : 'Ativar fonte grande'}
                  >
                    <div className="flex items-center gap-3">
                      <Type className="h-5 w-5 text-econotrip-blue" aria-hidden="true" />
                      <div className="text-left">
                          <h3 className={`font-medium ${settings.largeFonts ? 'text-econotrip-green' : 'text-econotrip-blue'}`}>Fonte Grande</h3>
                          <p className="text-sm text-gray-600">Aumenta o tamanho do texto</p>
                        </div>
                    </div>
                  </button>

                  <button
                    onClick={() => updateSetting("highContrast")}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-transparent ${
                      settings.highContrast
                        ? 'border-econotrip-green bg-econotrip-green/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={settings.highContrast}
                    aria-label={settings.highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
                  >
                    <div className="flex items-center gap-3">
                      <Contrast className="h-5 w-5 text-econotrip-blue" aria-hidden="true" />
                      <div className="text-left">
                        <h3 className={`font-medium ${settings.highContrast ? 'text-econotrip-green' : 'text-econotrip-blue'}`}>Alto Contraste</h3>
                        <p className="text-sm text-gray-600">Melhora a legibilidade</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      // If currently off, turn on and speak summary (then auto-deactivate)
                      if (!settings.voiceReading) {
                        updateSetting("voiceReading");
                        setTimeout(() => {
                          const explanationText = `Modo leitura em voz alta. Aqui está um exemplo de como funciona:`;
                          const summary = getPageSummary();
                          const fullText = `${explanationText} ${summary}`;
                          speakText(fullText, true); // true = deactivate after speech
                        }, 500);
                      } else {
                        // If currently on, just turn off
                        updateSetting("voiceReading");
                        stopSpeech();
                      }
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-transparent ${
                      settings.voiceReading
                        ? 'border-econotrip-green bg-econotrip-green/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={settings.voiceReading}
                    aria-label={settings.voiceReading ? 'Desativar modo leitura em voz alta' : 'Ativar modo leitura em voz alta'}
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className={`h-5 w-5 ${isSpeaking ? 'text-econotrip-orange animate-pulse' : settings.voiceReading ? 'text-econotrip-green' : 'text-econotrip-blue'}`} aria-hidden="true" />
                      <div className="text-left">
                        <h3 className={`font-medium ${settings.voiceReading ? 'text-econotrip-green' : 'text-econotrip-blue'}`}>
                          Modo leitura em voz alta
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isSpeaking ? 'Lendo página...' : settings.voiceReading ? 'Ativo - Clique para desativar' : 'Clique para ativar'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSpeaking && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            stopSpeech();
                          }}
                          className="px-2 py-1 text-xs bg-econotrip-orange text-white rounded hover:bg-econotrip-orange/90 transition-colors"
                          aria-label="Parar leitura"
                        >
                          Parar
                        </button>
                      )}
                    </div>
                  </button>
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
