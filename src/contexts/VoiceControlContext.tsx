import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';

interface VoiceControlContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  status: string;
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

export const VoiceControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Desconectado');

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
      console.log('Message from AI:', message);
      handleVoiceCommand(message);
    },
    onError: (error) => {
      console.error('Voice AI error:', error);
      setStatus('Erro na conexão');
    },
  });

  // Command handler for navigation and actions
  const handleVoiceCommand = useCallback((message: any) => {
    if (!message.message) return;

    const text = message.message.toLowerCase();

    // Navigation commands
    if (text.includes('ir para') || text.includes('abrir') || text.includes('navegar')) {
      if (text.includes('dashboard') || text.includes('painel')) {
        navigate('/dashboard');
      } else if (text.includes('busca') && text.includes('voo')) {
        navigate('/busca-voos');
      } else if (text.includes('perfil')) {
        navigate('/perfil');
      } else if (text.includes('roteiro')) {
        navigate('/meu-roteiro');
      } else if (text.includes('radar')) {
        navigate('/meus-radares');
      } else if (text.includes('fidelidade') || text.includes('milhas')) {
        navigate('/fidelidade');
      } else if (text.includes('nova viagem')) {
        navigate('/nova-viagem');
      } else if (text.includes('meu roteiro') || text.includes('roteiro') || text.includes('simulador')) {
        navigate('/meu-roteiro');
      } else if (text.includes('suporte')) {
        navigate('/suporte');
      } else if (text.includes('sustentável') || text.includes('sustentavel')) {
        navigate('/viagens-sustentaveis');
      }
    }

    // Search commands
    if (text.includes('buscar voo') || text.includes('procurar voo')) {
      navigate('/busca-voos');
    }

    // Back navigation
    if (text.includes('voltar') || text.includes('retornar')) {
      navigate(-1);
    }
  }, [navigate]);

  const startListening = useCallback(async () => {
    try {
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

      if (!agentId) {
        console.error('ElevenLabs Agent ID not configured');
        setStatus('Agente não configurado');
        return;
      }

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
      await conversation.endSession();
      setIsListening(false);
      setStatus('Desconectado');
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
        status,
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
