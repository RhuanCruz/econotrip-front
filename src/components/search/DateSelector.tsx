
import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { motion, AnimatePresence } from "framer-motion";

interface DateSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  disabled?: boolean;
}

export function DateSelector({
  label,
  value,
  onChange,
  minDate,
  disabled = false,
}: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const quickOptions = [
    { label: "Hoje", value: today.toISOString().split("T")[0], description: "Partida hoje" },
    { label: "Amanhã", value: tomorrow.toISOString().split("T")[0], description: "Partida amanhã" },
    { label: "Próxima semana", value: nextWeek.toISOString().split("T")[0], description: "Mais tempo para se preparar" },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleDateSelect = (selectedDate: string) => {
    onChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <label className="block text-lg font-medium text-econotrip-blue mb-3">
        <Calendar className="h-5 w-5 inline mr-2" />
        {label}
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
          <Clock className="h-5 w-5 text-econotrip-blue" />
          {value ? formatDate(value) : "Escolha uma data"}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Calendar className="h-5 w-5" />
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
            <Card className="p-4 shadow-xl">
              <div className="space-y-3">
                <h4 className="font-medium text-econotrip-blue mb-3">
                  Escolha uma opção prática
                </h4>
                {quickOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleDateSelect(option.value)}
                    className="w-full p-3 text-left rounded-lg hover:bg-econotrip-orange/10 transition-colors border border-gray-200"
                  >
                    <div className="font-medium text-econotrip-blue">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {formatDate(option.value)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </button>
                ))}
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Ou escolha uma data específica:</p>
                  <input
                    type="date"
                    value={value}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    min={minDate || today.toISOString().split("T")[0]}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 text-lg"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
