import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceControl } from '@/contexts/VoiceControlContext';

export const VoiceControlButton: React.FC = () => {
  const { isListening, startListening, stopListening, status } = useVoiceControl();

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">
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

      {/* Main button */}
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

      {/* Help text */}
      {!isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-right max-w-[150px]"
        >
          Clique para controlar o site por voz
        </motion.div>
      )}
    </div>
  );
};
