import React, { useState } from 'react';
import { Mic, MicOff, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceControl } from '@/contexts/VoiceControlContext';

export const VoiceControlButton: React.FC = () => {
  const { isListening, startListening, stopListening, status } = useVoiceControl();
  const [showHelp, setShowHelp] = useState(false);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 10 }}
            className="bg-white rounded-2xl shadow-2xl p-5 w-80 max-h-[500px] overflow-y-auto border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-lg">Assistente de Voz</h3>
              </div>
              <button
                onClick={toggleHelp}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-primary mb-2">📋 Como Usar</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Clique no botão de microfone</li>
                  <li>Aguarde o botão ficar vermelho</li>
                  <li>Diga seu comando claramente</li>
                  <li>Aguarde a busca ser executada</li>
                </ol>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold text-primary mb-2">✅ Exemplos de Comandos</h4>
                <div className="space-y-2">
                  <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                    <p className="text-xs font-mono text-green-800">
                      "buscar voo de São Paulo para Rio de Janeiro amanhã"
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                    <p className="text-xs font-mono text-green-800">
                      "quero viajar de Brasília para Miami hoje"
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                    <p className="text-xs font-mono text-green-800">
                      "passagem de SP para Paris dia 15 de março"
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold text-primary mb-2">💡 Dicas para Evitar Erros</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Use <strong>nomes completos</strong> das cidades: "São Paulo" ao invés de só "SP"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Fale <strong>claramente</strong> e em <strong>ritmo normal</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Sempre inclua: <strong>origem</strong>, <strong>destino</strong> e <strong>data</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Use datas relativas: "hoje", "amanhã", "próxima semana"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Aguarde em <strong>ambiente silencioso</strong></span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold text-red-600 mb-2">⚠️ Evite</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <span>Falar muito rápido ou muito devagar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <span>Usar apenas siglas sem contexto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <span>Esquecer de mencionar a data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✗</span>
                    <span>Falar em ambientes com muito ruído</span>
                  </li>
                </ul>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold text-primary mb-2">🌎 Cidades Suportadas</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  <div>• São Paulo</div>
                  <div>• Rio de Janeiro</div>
                  <div>• Brasília</div>
                  <div>• Salvador</div>
                  <div>• Fortaleza</div>
                  <div>• Belo Horizonte</div>
                  <div>• Curitiba</div>
                  <div>• Porto Alegre</div>
                  <div>• Recife</div>
                  <div>• Manaus</div>
                  <div>• Miami</div>
                  <div>• Nova York</div>
                  <div>• Paris</div>
                  <div>• Londres</div>
                  <div>• Lisboa</div>
                  <div className="col-span-2 text-center mt-1 text-primary">+ 25 outras cidades</div>
                </div>
              </div>

              <div className="border-t pt-3 bg-blue-50 -m-5 p-5 rounded-b-2xl">
                <p className="text-xs text-blue-800">
                  <strong>💬 Precisa de ajuda?</strong><br />
                  Se o comando não funcionar, tente reformular ou use a busca manual.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            {status}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons Container */}
      <div className="flex items-center gap-2">
        {/* Help Button */}
        <motion.button
          onClick={toggleHelp}
          className={`
            w-10 h-10 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-300
            ${showHelp
              ? 'bg-primary text-white'
              : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Ajuda para controle por voz"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>

        {/* Main Voice Button */}
        <motion.button
          onClick={handleClick}
          className={`
            relative w-14 h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-300
            ${isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-primary hover:bg-primary/90'
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isListening ? 'Parar controle por voz' : 'Iniciar controle por voz'}
        >
          {/* Pulse animation when listening */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-400"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}

          {/* Icon */}
          {isListening ? (
            <MicOff className="w-6 h-6 text-white relative z-10" />
          ) : (
            <Mic className="w-6 h-6 text-white relative z-10" />
          )}
        </motion.button>
      </div>

      {/* Help hint */}
      {!isListening && !showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-right max-w-[150px]"
        >
          Clique no botão de ajuda para ver instruções
        </motion.div>
      )}
    </div>
  );
};
