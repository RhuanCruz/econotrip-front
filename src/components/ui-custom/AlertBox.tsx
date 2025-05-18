
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
        return "bg-econotrip-green/20 border-econotrip-green text-green-800";
      case "error":
        return "bg-red-50 border-red-400 text-red-800";
      default:
        return "bg-blue-50 border-econotrip-blue text-econotrip-blue";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        getTypeClasses(),
        className
      )}
    >
      <div className="flex items-start">
        {Icon && (
          <div className="flex-shrink-0 mr-3">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
        <div>
          {title && (
            <h3 className="text-xl font-medium mb-2">{title}</h3>
          )}
          <div className="text-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}
