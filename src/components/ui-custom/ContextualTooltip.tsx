
import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContextualTooltipProps {
  content: string;
  className?: string;
}

export function ContextualTooltip({ content, className = "" }: ContextualTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center w-5 h-5 text-econotrip-blue hover:text-econotrip-orange transition-colors ml-1 ${className}`}
            aria-label="Ajuda"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-50">
          <p className="text-sm text-gray-700 leading-relaxed text-wrap break-words">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
