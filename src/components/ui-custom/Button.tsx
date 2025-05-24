
import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "default" | "lg" | "sm";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "default", 
    icon: Icon,
    iconPosition = "left",
    loading = false,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-target",
          variant === "primary" && "bg-econotrip-orange text-white hover:bg-econotrip-orange/90",
          variant === "secondary" && "border-2 border-econotrip-blue text-econotrip-blue hover:bg-econotrip-blue/10 bg-white",
          size === "default" && "h-12 px-6 py-3 text-base",
          size === "sm" && "h-10 px-4 py-2 text-sm",
          size === "lg" && "h-14 px-8 py-4 text-base",
          className
        )}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : Icon && iconPosition === "left" ? (
          <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
        ) : null}
        
        {children}
        
        {!loading && Icon && iconPosition === "right" && (
          <Icon className="ml-2 h-5 w-5" aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
