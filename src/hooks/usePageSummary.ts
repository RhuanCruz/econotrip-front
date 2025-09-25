import { useEffect } from 'react';
import { triggerPageSummary, isVoiceReadingEnabled } from '@/utils/accessibility';

/**
 * Hook to automatically announce page content when voice reading is enabled
 */
export const usePageSummary = (summary: string, deps: any[] = []) => {
  useEffect(() => {
    // Only announce if voice reading is enabled
    if (isVoiceReadingEnabled()) {
      triggerPageSummary({ 
        summary, 
        delay: 800 // Small delay to let page content load
      });
    }
  }, [summary, ...deps]);

  // Return function to manually trigger announcement
  return {
    announce: (customSummary?: string) => {
      triggerPageSummary({ summary: customSummary || summary });
    }
  };
};

/**
 * Hook for dynamic content that changes frequently (like search results)
 */
export const useDynamicPageSummary = () => {
  const announce = (summary: string, delay = 0) => {
    if (isVoiceReadingEnabled()) {
      triggerPageSummary({ summary, delay });
    }
  };

  return { announce };
};