
import React from "react";
import { Check, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
  currentStep: "objetivo" | "planejamento";
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { id: "objetivo", label: "Objetivo", icon: Target },
    { id: "planejamento", label: "Planejamento", icon: Calendar },
  ];

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = currentStep === "planejamento" && step.id === "objetivo";
          
          return (
            <div key={step.id} className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-econotrip-orange text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </motion.div>
              
              <span className={`text-sm font-medium ${
                isActive ? "text-econotrip-blue" : "text-gray-500"
              }`}>
                {step.label}
              </span>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
