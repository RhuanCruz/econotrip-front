
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="flex items-start space-x-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "block h-5 w-5 sm:h-6 sm:w-6 rounded-md border-2 border-econotrip-blue transition-all duration-200 group-hover:border-econotrip-orange",
              props.checked && "bg-econotrip-orange border-econotrip-orange",
              className
            )}
          >
            {props.checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-white p-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <span className="text-base sm:text-lg text-econotrip-blue font-medium">
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-econotrip-blue/60 mt-1">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
