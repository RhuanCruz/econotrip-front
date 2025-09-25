/**
 * Utility functions for accessibility features, specifically voice reading
 */

export interface PageSummaryOptions {
  summary?: string;
  priority?: 'high' | 'normal' | 'low';
  delay?: number;
}

/**
 * Trigger page summary reading
 * @param options - Configuration for the page summary
 */
export const triggerPageSummary = (options: PageSummaryOptions = {}) => {
  const event = new CustomEvent('requestPageSummary', {
    detail: {
      summary: options.summary,
      priority: options.priority || 'normal',
      delay: options.delay || 0
    }
  });
  
  if (options.delay && options.delay > 0) {
    setTimeout(() => {
      window.dispatchEvent(event);
    }, options.delay);
  } else {
    window.dispatchEvent(event);
  }
};

/**
 * Check if voice reading is currently enabled
 */
export const isVoiceReadingEnabled = (): boolean => {
  return document.documentElement.classList.contains('accessibility-voice-reading');
};

/**
 * Get current accessibility settings from localStorage
 */
export const getAccessibilitySettings = () => {
  try {
    const settings = localStorage.getItem('econotrip_accessibility');
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.warn('Failed to load accessibility settings:', error);
    return null;
  }
};

/**
 * Common page summaries for different page types
 */
export const PageSummaries = {
  home: "Bem-vindo ao EconoTrip. Encontre os melhores preços de passagens aéreas. Use o formulário de busca para começar a planejar sua viagem.",
  
  search: (resultsCount?: number) => 
    `Página de resultados de voos. ${resultsCount ? `Encontrados ${resultsCount} voos disponíveis.` : 'Refine sua busca usando os filtros disponíveis.'} Compare preços e escolha a melhor opção.`,
  
  profile: "Seu perfil no EconoTrip. Gerencie suas informações pessoais, preferências de viagem e histórico de buscas.",
  
  radar: (alertsCount?: number) => 
    `Alertas de preços. ${alertsCount ? `Você tem ${alertsCount} alertas ativos.` : 'Crie alertas para ser notificado quando os preços baixarem.'} Configure monitoramento automático de preços.`,
  
  simulation: "Simulador de viagens. Compare diferentes destinos, datas e opções para encontrar a melhor combinação para sua viagem.",
  
  itinerary: "Seus roteiros de viagem. Planeje e organize seus itinerários detalhadamente, incluindo voos, hotéis e atividades.",
  
  booking: "Finalização da reserva. Revise os detalhes do seu voo e complete a compra com segurança.",
  
  help: "Central de ajuda. Encontre respostas para suas dúvidas sobre como usar o EconoTrip e fazer suas reservas."
};

/**
 * Hook for pages to automatically announce their content when voice reading is enabled
 * Usage: Call this function in your page component's useEffect
 */
export const usePageAnnouncement = (summary: string, dependencies: any[] = []) => {
  if (typeof window === 'undefined') return;
  
  const announce = () => {
    if (isVoiceReadingEnabled()) {
      triggerPageSummary({ summary, delay: 1000 });
    }
  };
  
  // Announce on mount if voice reading is enabled
  announce();
  
  // Re-announce when dependencies change
  dependencies.forEach(() => {
    announce();
  });
};