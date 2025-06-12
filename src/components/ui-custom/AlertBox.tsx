
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AlertBoxProps {
  className?: string;
  title?: string;
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "error";
  icon?: LucideIcon;
}

export function AlertBox({
  className,
  title,
  children,
  type = "info",
  icon: Icon,
}: AlertBoxProps) {
  const getTypeClasses = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-400 text-yellow-800";
      case "success":
        return "bg-econotrip-green/10 border-econotrip-green text-econotrip-blue";
      case "error":
        return "bg-red-50 border-red-400 text-red-800";
      default:
        return "bg-econotrip-blue/5 border-econotrip-blue/30 text-econotrip-blue";
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 sm:p-6 transition-all duration-200",
        getTypeClasses(),
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 mt-0.5">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
          )}
          <div className="text-base sm:text-lg leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
