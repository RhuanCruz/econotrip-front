
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "default" | "highlight";
}

export function Card({
  className,
  title,
  description,
  footer,
  children,
  variant = "default",
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card shadow-sm",
        variant === "highlight" && "border-econotrip-green bg-econotrip-green/10",
        className
      )}
    >
      {(title || description) && (
        <div className="p-6 border-b">
          {title && (
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-lg text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      )}
      {children && <div className="p-6">{children}</div>}
      {footer && (
        <div className="p-6 border-t bg-muted/50">{footer}</div>
      )}
    </div>
  );
}
