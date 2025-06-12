
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "default" | "highlight";
  onClick?: () => void;
}

export function Card({
  className,
  title,
  description,
  footer,
  children,
  variant = "default",
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card shadow-sm transition-all duration-200",
        variant === "highlight" && "border-econotrip-green bg-econotrip-green/10",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {(title || description) && (
        <div className="p-4 sm:p-6 border-b">
          {title && (
            <h3 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight text-econotrip-blue">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-base sm:text-lg text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      )}
      {children && <div className="p-4 sm:p-6">{children}</div>}
      {footer && (
        <div className="p-4 sm:p-6 border-t bg-muted/50">{footer}</div>
      )}
    </div>
  );
}
