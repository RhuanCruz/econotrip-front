
import React from "react";
import { Button } from "@/components/ui-custom/Button";
import { Check, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonsProps {
  onReserve: () => void;
}

export function ActionButtons({ onReserve }: ActionButtonsProps) {
  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-24 right-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="h-14 w-14 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                aria-label="Ajuda rápida"
              >
                <HelpCircle className="h-7 w-7" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Ajuda rápida</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Fixed Bottom CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-md">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="primary"
            size="lg"
            icon={Check}
            onClick={onReserve}
            className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-xl rounded-xl h-16"
          >
            Reservar este voo
          </Button>
        </div>
      </div>
    </>
  );
}
