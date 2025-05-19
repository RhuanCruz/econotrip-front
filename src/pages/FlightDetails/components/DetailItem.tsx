
import React from "react";
import { LucideIcon } from "lucide-react";

interface DetailItemProps {
  icon: LucideIcon;
  title: string;
  value: string;
  variant?: "default" | "success";
}

export function DetailItem({ icon: Icon, title, value, variant = "default" }: DetailItemProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-econotrip-green/10";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl ${getVariantClasses()}`}>
      <Icon className={`h-6 w-6 ${variant === "success" ? "text-econotrip-green" : "text-econotrip-blue"}`} />
      <div>
        <p className={`font-medium ${variant === "success" ? "text-econotrip-green" : "text-econotrip-blue"}`}>{title}</p>
        <p className="text-gray-700">{value}</p>
      </div>
    </div>
  );
}
