
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
      <div className="fixed bottom-20 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="h-12 w-12 rounded-full bg-econotrip-blue shadow-lg flex items-center justify-center text-white hover:bg-econotrip-blue/90 transition-colors"
                aria-label="Ajuda rápida"
              >
                <HelpCircle className="h-6 w-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Ajuda rápida</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Fixed Bottom CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-md">
        <div className="max-w-sm mx-auto">
          <Button
            variant="primary"
            size="lg"
            icon={Check}
            onClick={onReserve}
            className="w-full bg-gradient-to-r from-econotrip-orange to-[#FDCB6E] text-white text-lg rounded-xl h-14"
          >
            Reservar este voo
          </Button>
        </div>
      </div>
    </>
  );
}
