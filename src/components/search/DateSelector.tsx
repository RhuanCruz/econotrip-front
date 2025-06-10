
import React from "react";
import { DataSelector } from "@/components/ui-custom/DataSelector";

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
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const quickOptions = [
    { 
      label: "Hoje", 
      description: "Partida hoje", 
      date: today.toISOString().split("T")[0], 
      icon: "Clock" as const 
    },
    { 
      label: "Amanhã", 
      description: "Partida amanhã", 
      date: tomorrow.toISOString().split("T")[0], 
      icon: "Calendar" as const 
    },
    { 
      label: "Próxima semana", 
      description: "Mais tempo para se preparar", 
      date: nextWeek.toISOString().split("T")[0], 
      icon: "Leaf" as const,
      badge: "Mais tranquilo"
    },
  ];

  return (
    <DataSelector
      title={label}
      options={quickOptions}
      allowCustomDate={true}
      value={value}
      onChange={onChange}
      minDate={minDate}
      disabled={disabled}
    />
  );
}
