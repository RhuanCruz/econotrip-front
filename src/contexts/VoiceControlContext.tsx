import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { parseFlightCommand } from '@/utils/voiceCommandParser';

interface VoiceControlContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  status: string;
}

interface FlightSearchParams {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta?: string;
  passageiros?: {
    adults: number;
    children: number;
    infants: number;
  };
  classe?: string;
  usarMilhas?: boolean;
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

export const VoiceControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Desconectado');
  const conversationRef = useRef<any>(null);
  const messageCountRef = useRef(0);
  const autoDisconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to disconnect after executing a command
  const disconnectAfterCommand = useCallback((delay = 500) => {
    setTimeout(async () => {
      try {
        if (conversationRef.current) {
          await conversationRef.current.endSession();
          setIsListening(false);
          setStatus('Desconectado');
          console.log('🔌 Voice session ended after command execution');
        }
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }, delay);
  }, []);

  // Command handler for navigation and flight search
  const handleVoiceCommand = useCallback((message: any) => {
    // Increment message count
    messageCountRef.current += 1;
    console.log(`📨 Message #${messageCountRef.current}:`, message);

    // Clear any existing auto-disconnect timer
    if (autoDisconnectTimerRef.current) {
      clearTimeout(autoDisconnectTimerRef.current);
    }

    // Set auto-disconnect after 3 seconds of inactivity (safety mechanism)
    autoDisconnectTimerRef.current = setTimeout(() => {
      console.log('⏰ Auto-disconnect timer triggered (3s inactivity)');
      if (conversationRef.current && isListening) {
        disconnectAfterCommand(0);
      }
    }, 3000);

    // Try different message formats
    let text = '';

    if (message?.message) {
      text = message.message;
    } else if (message?.text) {
      text = message.text;
    } else if (typeof message === 'string') {
      text = message;
    } else if (message?.content) {
      text = message.content;
    } else if (message?.role === 'user' && message?.content) {
      text = message.content;
    }

    if (!text) {
      console.log('❌ No text found in message');
      return;
    }

    text = text.toLowerCase();
    console.log('✅ Processing voice command:', text);

    // Flight search command with details
    if (
      (text.includes('buscar voo') || text.includes('procurar voo') || text.includes('quero viajar') ||
       text.includes('voar') || text.includes('passagem'))
    ) {
      console.log('🎯 Detected flight search command');
      const parsed = parseFlightCommand(text);

      console.log('📊 Parse result:', {
        confidence: `${parsed.confidence}%`,
        origem: parsed.origem,
        destino: parsed.destino,
        dataIda: parsed.dataIda,
        dataVolta: parsed.dataVolta,
        passageiros: parsed.passageiros,
        classe: parsed.classe,
        errors: parsed.errors
      });

      // Only proceed if confidence is above 50%
      if (parsed.confidence >= 50 && parsed.origem && parsed.destino && parsed.dataIda) {
        const searchParams: Partial<FlightSearchParams> = {
          origem: parsed.origem,
          destino: parsed.destino,
          dataIda: parsed.dataIda,
          dataVolta: parsed.dataVolta,
          passageiros: {
            adults: parsed.passageiros || 1,
            children: 0,
            infants: 0
          },
          classe: parsed.classe || 'economica',
        };

        console.log('✅ Navigating to flight search with params:', searchParams);
        setStatus('Buscando voos...');
        disconnectAfterCommand();
        navigate('/busca-voos', { state: { searchParams } });
        return;
      } else {
        console.log('❌ Low confidence or missing fields:', parsed.errors);
        setStatus(`Erro: ${parsed.errors.join(', ')}`);

        // Auto-disconnect even on error
        disconnectAfterCommand(2000); // Wait longer for user to see error
        return;
      }
    }

    // Navigation commands
    if (text.includes('ir para') || text.includes('abrir') || text.includes('navegar')) {
      if (text.includes('dashboard') || text.includes('painel')) {
        disconnectAfterCommand();
        navigate('/dashboard');
        return;
      } else if (text.includes('busca') && text.includes('voo')) {
        disconnectAfterCommand();
        navigate('/busca-voos');
        return;
      } else if (text.includes('perfil')) {
        disconnectAfterCommand();
        navigate('/perfil');
        return;
      } else if (text.includes('roteiro')) {
        disconnectAfterCommand();
        navigate('/meu-roteiro');
        return;
      } else if (text.includes('radar')) {
        disconnectAfterCommand();
        navigate('/meus-radares');
        return;
      } else if (text.includes('fidelidade') || text.includes('milhas')) {
        disconnectAfterCommand();
        navigate('/fidelidade');
        return;
      } else if (text.includes('nova viagem')) {
        disconnectAfterCommand();
        navigate('/nova-viagem');
        return;
      } else if (text.includes('suporte')) {
        disconnectAfterCommand();
        navigate('/suporte');
        return;
      } else if (text.includes('sustentável') || text.includes('sustentavel')) {
        disconnectAfterCommand();
        navigate('/viagens-sustentaveis');
        return;
      }
    }

    // Simple search commands
    if (text.includes('buscar voo') || text.includes('procurar voo')) {
      disconnectAfterCommand();
      navigate('/busca-voos');
      return;
    }

    // Back navigation
    if (text.includes('voltar') || text.includes('retornar')) {
      disconnectAfterCommand();
      navigate(-1);
      return;
    }

    if (messageCountRef.current >= 2) {
      console.log('💬 Conversation mode detected, disconnecting after agent response');
      disconnectAfterCommand(2000); // Give time for user to hear the response
    }
  }, [navigate, disconnectAfterCommand]);

  const conversation = useConversation({
    onConnect: () => {
      setStatus('Conectado');
      console.log('Voice AI connected');
    },
    onDisconnect: () => {
      setStatus('Desconectado');
      setIsListening(false);
      console.log('Voice AI disconnected');
    },
    onMessage: (message) => {
      handleVoiceCommand(message);
    },
    onError: (error) => {
      console.error('Voice AI error:', error);
      setStatus('Erro na conexão');
    },
  });

  // Store conversation in ref for access in handleVoiceCommand
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const startListening = useCallback(async () => {
    try {
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

      if (!agentId) {
        console.error('ElevenLabs Agent ID not configured');
        setStatus('Agente não configurado');
        return;
      }

      // Reset message counter on new session
      messageCountRef.current = 0;

      // Clear any existing timers
      if (autoDisconnectTimerRef.current) {
        clearTimeout(autoDisconnectTimerRef.current);
      }

      //@ts-ignore
      await conversation.startSession({
        agentId: agentId,
      });

      setIsListening(true);
      setStatus('Ouvindo...');
    } catch (error) {
      console.error('Failed to start voice session:', error);
      setStatus('Erro ao iniciar');
    }
  }, [conversation]);

  const stopListening = useCallback(async () => {
    try {
      // Clear timers
      if (autoDisconnectTimerRef.current) {
        clearTimeout(autoDisconnectTimerRef.current);
      }

      await conversation.endSession();
      setIsListening(false);
      setStatus('Desconectado');
      messageCountRef.current = 0;
    } catch (error) {
      console.error('Failed to stop voice session:', error);
    }
  }, [conversation]);

  return (
    <VoiceControlContext.Provider
      value={{
        isListening,
        startListening,
        stopListening,
        status
      }}
    >
      {children}
    </VoiceControlContext.Provider>
  );
};

export const useVoiceControl = () => {
  const context = useContext(VoiceControlContext);
  if (context === undefined) {
    throw new Error('useVoiceControl must be used within a VoiceControlProvider');
  }
  return context;
};
