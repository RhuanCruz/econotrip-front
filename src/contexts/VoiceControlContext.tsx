import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import { parseFlightCommand, parseRadarCommand } from '@/utils/voiceCommandParser';
import { RadarService } from '@/api/radar/RadarService';
import { useAuthStore } from '@/stores/authStore';

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
  const { token } = useAuthStore();
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

    // Reset auto-disconnect timer on each message
    // Only disconnect after 60 seconds of complete inactivity
    autoDisconnectTimerRef.current = setTimeout(() => {
      console.log('⏰ Auto-disconnect timer triggered (60s inactivity)');
      if (conversationRef.current && isListening) {
        disconnectAfterCommand(0);
      }
    }, 60000);

    // Try different message formats
    let text = '';
    let role = '';

    // Check message role first to filter agent responses
    if (message?.role) {
      role = message.role;
      console.log('📝 Message role:', role);

      // Skip agent messages - only process user messages
      if (role === 'assistant' || role === 'agent') {
        console.log('🤖 Agent message detected, ignoring');
        return;
      }
    }

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

    // Detect if this is a question or informational request (don't disconnect)
    const isQuestion = text.includes('?') ||
                      text.includes('como') ||
                      text.includes('qual') ||
                      text.includes('quando') ||
                      text.includes('onde') ||
                      text.includes('por que') ||
                      text.includes('porque') ||
                      text.includes('quem') ||
                      text.includes('o que') ||
                      text.includes('me fale') ||
                      text.includes('me diga') ||
                      text.includes('explique') ||
                      text.includes('ajuda') ||
                      text.includes('pode');

    if (isQuestion) {
      console.log('❓ Question detected, keeping connection open for response');
      return; // Don't process as command, let agent respond naturally
    }

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

    // Radar-specific actions (must come before general navigation)
    // Full radar creation with parameters
    if (text.includes('criar radar') || text.includes('novo radar') || text.includes('adicionar radar') ||
        (text.includes('monitorar') && (text.includes('voo') || text.includes('preço') || text.includes('preco')))) {
      console.log('🎯 Detected create radar command');

      // Try to parse radar parameters
      const parsed = parseRadarCommand(text);

      console.log('📊 Radar parse result:', {
        confidence: `${parsed.confidence}%`,
        origem: parsed.origem,
        destino: parsed.destino,
        inicio: parsed.inicio,
        fim: parsed.fim,
        valor: parsed.valor,
        tipo: parsed.tipo,
        errors: parsed.errors
      });

      console.log('🔐 Auth check:', {
        hasToken: !!token,
        tokenValue: token ? `${token.substring(0, 20)}...` : 'null',
        hasOrigem: !!parsed.origem,
        origemValue: parsed.origem,
        hasDestino: !!parsed.destino,
        destinoValue: parsed.destino,
        confidence: parsed.confidence,
        confidenceOK: parsed.confidence >= 50,
        willCreate: parsed.confidence >= 50 && parsed.origem && parsed.destino && token
      });

      // If we have good confidence and both origin and destination, create radar automatically
      if (parsed.confidence >= 50 && parsed.origem && parsed.destino && token) {
        // Build radar data, excluding undefined values
        const radarData: any = {
          origin: parsed.origem,
          destination: parsed.destino,
          type: parsed.tipo || 'MONEY'
        };

        // Only add optional fields if they have values
        if (parsed.inicio) radarData.start = parsed.inicio;
        if (parsed.fim) radarData.end = parsed.fim;
        if (parsed.valor) radarData.value = parsed.valor;

        console.log('✅ Creating radar automatically:', radarData);
        console.log('🌐 Calling RadarService.create...');
        setStatus('Criando radar...');

        RadarService.create(token, radarData as any)
          .then((response) => {
            console.log('✅ Radar created successfully, response:', response);
            setStatus('Radar criado com sucesso!');
            disconnectAfterCommand(1500);
            // Navigate to radares screen to show the new radar
            setTimeout(() => {
              console.log('📍 Navigating to /meus-radares');
              navigate('/meus-radares');
            }, 500);
          })
          .catch((error) => {
            console.error('❌ Error creating radar:', error);
            console.error('❌ Error details:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
            setStatus('Erro ao criar radar');
            disconnectAfterCommand(2000);
          });
        return;
      } else {
        // Low confidence, just open the modal without prefilling
        console.log('⚠️ Low confidence, opening radar form');
        setStatus('Abrindo formulário...');
        disconnectAfterCommand();

        const radarParams = parsed.origem && parsed.destino ? {
          origem: parsed.origem,
          destino: parsed.destino,
          inicio: parsed.inicio,
          fim: parsed.fim,
          valor: parsed.valor,
          tipo: parsed.tipo
        } : undefined;

        navigate('/meus-radares', { state: { action: 'create', radarParams } });
        return;
      }
    }

    if ((text.includes('abrir') || text.includes('ver')) && text.includes('radar')) {
      console.log('🎯 Detected open radar command');
      // Extract radar number if specified (e.g., "abrir radar 1", "ver segundo radar")
      const radarMatch = text.match(/(?:radar|ofertas?)\s+(\d+|primeiro|segunda|segundo|terceiro)/);
      if (radarMatch) {
        const position = radarMatch[1];
        const index = position === 'primeiro' ? 0 :
                     position === 'segundo' || position === 'segunda' ? 1 :
                     position === 'terceiro' ? 2 : parseInt(position) - 1;

        disconnectAfterCommand();
        navigate('/meus-radares', { state: { action: 'open', index } });
        return;
      }
    }

    if ((text.includes('remover') || text.includes('deletar') || text.includes('excluir') || text.includes('apagar')) &&
        text.includes('radar')) {
      console.log('🎯 Detected delete radar command');
      // Extract radar number if specified
      const radarMatch = text.match(/(?:radar|ofertas?)\s+(\d+|primeiro|segunda|segundo|terceiro)/);
      if (radarMatch) {
        const position = radarMatch[1];
        const index = position === 'primeiro' ? 0 :
                     position === 'segundo' || position === 'segunda' ? 1 :
                     position === 'terceiro' ? 2 : parseInt(position) - 1;

        disconnectAfterCommand();
        navigate('/meus-radares', { state: { action: 'delete', index } });
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
      } else if (text.includes('radar') || text.includes('radares')) {
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

    // Only disconnect if this is clearly NOT a question or conversation
    // Allow the agent to respond to questions naturally
    console.log('💬 Message processed, keeping connection open for conversation');
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
