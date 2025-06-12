
import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "lg" | "sm" | "xs";
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
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-econotrip-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-target",
          // Variants
          variant === "primary" && "bg-econotrip-orange text-white hover:bg-econotrip-orange/90 shadow-md hover:shadow-lg active:scale-95",
          variant === "secondary" && "border-2 border-econotrip-blue text-econotrip-blue hover:bg-econotrip-blue/5 bg-white hover:shadow-md active:scale-95",
          variant === "outline" && "border border-econotrip-blue/30 text-econotrip-blue hover:bg-econotrip-blue/5 hover:border-econotrip-blue",
          variant === "ghost" && "text-econotrip-blue hover:bg-econotrip-blue/10",
          // Sizes - mobile first
          size === "xs" && "h-8 px-3 py-1.5 text-xs min-w-[32px]",
          size === "sm" && "h-9 px-4 py-2 text-sm min-w-[36px]",
          size === "default" && "h-11 px-5 py-2.5 text-base min-w-[44px]",
          size === "lg" && "h-12 px-6 py-3 text-lg min-w-[48px]",
          className
        )}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : Icon && iconPosition === "left" ? (
          <Icon className={cn(
            "flex-shrink-0",
            size === "xs" && "h-3 w-3 mr-1.5",
            size === "sm" && "h-4 w-4 mr-2",
            size === "default" && "h-5 w-5 mr-2",
            size === "lg" && "h-6 w-6 mr-2.5"
          )} aria-hidden="true" />
        ) : null}
        
        <span className="truncate">{children}</span>
        
        {!loading && Icon && iconPosition === "right" && (
          <Icon className={cn(
            "flex-shrink-0",
            size === "xs" && "h-3 w-3 ml-1.5",
            size === "sm" && "h-4 w-4 ml-2",
            size === "default" && "h-5 w-5 ml-2",
            size === "lg" && "h-6 w-6 ml-2.5"
          )} aria-hidden="true" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
