
import React from "react";

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function ScreenContainer({ children, className = "", title }: ScreenContainerProps) {
  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-screen-sm mx-auto px-4 py-6 pb-32 space-y-6">
        {title && (
          <h1 className="text-2xl font-semibold text-econotrip-blue mb-4 text-wrap text-balance">
            {title}
          </h1>
        )}
        <div className={className}>
          {children}
        </div>
      </div>
    </div>
  );
}
