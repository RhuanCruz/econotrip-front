
import React, { useState } from "react";
import { Button } from "@/components/ui-custom/Button";
import { Card } from "@/components/ui-custom/Card";
import { Input } from "@/components/ui-custom/Input";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, Leaf, Check } from "lucide-react";

interface DateOption {
  label: string;
  description: string;
  date: string;
  icon: "Clock" | "Calendar" | "Leaf";
  badge?: string;
}

interface DataSelectorProps {
  title: string;
  options: DateOption[];
  allowCustomDate?: boolean;
  value?: string;
  onChange: (date: string) => void;
  minDate?: string;
  disabled?: boolean;
}

const iconMap = {
  Clock,
  Calendar,
  Leaf,
};

export function DataSelector({
  title,
  options,
  allowCustomDate = true,
  value,
  onChange,
  minDate,
  disabled = false,
}: DataSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const today = new Date();
  const defaultMinDate = minDate || today.toISOString().split("T")[0];

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleOptionSelect = (option: DateOption) => {
    setSelectedOption(option.date);
    setShowCustomInput(false);
    onChange(option.date);
  };

  const handleCustomDateChange = (date: string) => {
    setCustomDate(date);
    setSelectedOption(null);
    onChange(date);
  };

  const handleShowCustomInput = () => {
    setShowCustomInput(true);
    setSelectedOption(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Título da seção */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-econotrip-blue text-balance">
          {title}
        </h3>
        <p className="text-base text-gray-600 mt-2 text-balance">
          Escolha uma das opções abaixo ou selecione uma data específica
        </p>
      </div>

      {/* Sugestões rápidas */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-econotrip-blue">
          Opções rápidas
        </h4>
        
        {/* Cards responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {options.map((option, index) => {
            const IconComponent = iconMap[option.icon];
            const isSelected = selectedOption === option.date;
            
            return (
              <motion.div
                key={option.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && handleOptionSelect(option)}
                  className={`w-full text-left transition-all duration-200 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  aria-label={`Selecionar ${option.label}, ${option.description}`}
                >
                  <Card
                    className={`transition-all duration-200 ${
                      isSelected
                        ? "ring-2 ring-econotrip-orange bg-econotrip-orange/5 border-econotrip-orange"
                        : "hover:bg-blue-50 focus-within:ring-2 focus-within:ring-econotrip-blue/50"
                    }`}
                  >
                    <div className="p-4 min-h-[120px] flex flex-col justify-between gap-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-econotrip-blue/10 rounded-lg">
                            <IconComponent className="h-6 w-6 text-econotrip-blue" />
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="p-1 bg-econotrip-orange rounded-full"
                            >
                              <Check className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                        {option.badge && (
                          <span className="px-2 py-1 text-xs font-medium bg-econotrip-green/10 text-econotrip-green rounded-full">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-left">
                        <h5 className="text-lg font-semibold text-econotrip-blue text-balance">
                          {option.label}
                        </h5>
                        <p className="text-sm text-gray-600 text-balance mb-1">
                          {formatDateDisplay(option.date)}
                        </p>
                        <p className="text-xs text-gray-500 text-balance">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Campo de seleção manual */}
      {allowCustomDate && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-base text-gray-600 mb-4 text-balance">
              Prefere escolher outra data?
            </p>
            
            {!showCustomInput ? (
              <Button
                variant="secondary"
                onClick={handleShowCustomInput}
                disabled={disabled}
                className="h-14 px-6 text-base min-h-[44px]"
                aria-label="Mostrar seletor de data personalizada"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Escolher data específica
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <label className="block text-lg font-medium text-econotrip-blue text-balance">
                  Selecione uma data personalizada:
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="flex-1 min-w-0">
                    <Input
                      type="date"
                      value={customDate}
                      onChange={(e) => handleCustomDateChange(e.target.value)}
                      min={defaultMinDate}
                      disabled={disabled}
                      className="h-14 text-lg min-h-[44px]"
                      aria-label="Selecionar data personalizada"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowCustomInput(false)}
                    disabled={disabled}
                    className="h-14 px-4 min-h-[44px]"
                    aria-label="Cancelar seleção de data personalizada"
                  >
                    Cancelar
                  </Button>
                </div>
                {customDate && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-econotrip-green font-medium text-center"
                  >
                    ✅ Data selecionada: {formatDateDisplay(customDate)}
                  </motion.p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
