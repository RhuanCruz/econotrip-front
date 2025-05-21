
import React from "react";

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenContainer({ children, className = "" }: ScreenContainerProps) {
  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className={`mx-auto px-6 py-6 pb-24 ${className}`}>
        {children}
      </div>
    </div>
  );
}
