
import React from "react";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface SustainableBadgeProps {
  type: "carbon" | "community";
  className?: string;
}

export function SustainableBadge({ type, className = "" }: SustainableBadgeProps) {
  const badgeConfig = {
    carbon: {
      text: "Menor emissão de carbono",
      bgColor: "bg-econotrip-green/10",
      textColor: "text-econotrip-green",
      borderColor: "border-econotrip-green/30"
    },
    community: {
      text: "Responsável com comunidades",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    }
  };

  const config = badgeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <Leaf className="h-4 w-4" aria-hidden="true" />
      <span>{config.text}</span>
    </motion.div>
  );
}
