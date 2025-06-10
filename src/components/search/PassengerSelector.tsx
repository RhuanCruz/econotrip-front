
import React, { useState } from "react";
import { Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion, AnimatePresence } from "framer-motion";

interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

interface PassengerSelectorProps {
  value: PassengerCount;
  onChange: (value: PassengerCount) => void;
  disabled?: boolean;
}

export function PassengerSelector({
  value,
  onChange,
  disabled = false,
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateCount = (type: keyof PassengerCount, increment: boolean) => {
    const newValue = { ...value };
    if (increment) {
      newValue[type] = Math.min(newValue[type] + 1, type === 'infants' ? 2 : 9);
    } else {
      newValue[type] = Math.max(newValue[type] - 1, type === 'adults' ? 1 : 0);
    }
    onChange(newValue);
  };

  const totalPassengers = value.adults + value.children + value.infants;

  const getPassengerText = () => {
    if (totalPassengers === 1) return "1 passageiro";
    return `${totalPassengers} passageiros`;
  };

  return (
    <div className="relative w-full">
      <label className="block text-lg font-medium text-econotrip-blue mb-3">
        <Users className="h-5 w-5 inline mr-2" />
        Passageiros
      </label>
      
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full h-16 justify-between text-left text-lg"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-3">
          <Users className="h-5 w-5 text-econotrip-blue" />
          {getPassengerText()}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="h-5 w-5" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2"
          >
            <Card className="p-6 shadow-xl">
              <div className="space-y-6">
                {/* Adultos */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-econotrip-blue text-lg">
                      Adultos
                    </div>
                    <div className="text-sm text-gray-600">
                      Acima de 12 anos
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCount('adults', false)}
                      disabled={value.adults <= 1}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Diminuir adultos"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-lg">
                      {value.adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCount('adults', true)}
                      disabled={value.adults >= 9}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Aumentar adultos"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Crianças */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-econotrip-blue text-lg">
                      Crianças
                    </div>
                    <div className="text-sm text-gray-600">
                      De 2 a 11 anos
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCount('children', false)}
                      disabled={value.children <= 0}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Diminuir crianças"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-lg">
                      {value.children}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCount('children', true)}
                      disabled={value.children >= 9}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Aumentar crianças"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Bebês */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-econotrip-blue text-lg">
                      Bebês
                    </div>
                    <div className="text-sm text-gray-600">
                      Até 2 anos (no colo)
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCount('infants', false)}
                      disabled={value.infants <= 0}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Diminuir bebês"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-lg">
                      {value.infants}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCount('infants', true)}
                      disabled={value.infants >= 2}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      aria-label="Aumentar bebês"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Confirmar - {getPassengerText()}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
