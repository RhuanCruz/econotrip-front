import React from "react";

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function ScreenContainer({ children, className = "", title }: ScreenContainerProps) {
  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-sm mx-auto px-1 py-4 pb-24 space-y-4">
        {title && (
          <h1 className="text-xl font-museomoderno font-bold text-econotrip-blue mb-4 text-center px-2">
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
