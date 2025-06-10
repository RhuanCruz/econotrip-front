
import React from "react";
import { Heart } from "lucide-react";

interface MotivationalHintProps {
  message: string;
  className?: string;
}

export function MotivationalHint({ message, className = "" }: MotivationalHintProps) {
  return (
    <div className={`flex items-center gap-2 p-3 bg-econotrip-green/10 rounded-xl border border-econotrip-green/20 ${className}`}>
      <Heart className="h-4 w-4 text-econotrip-green flex-shrink-0" />
      <p className="text-sm text-econotrip-green font-medium leading-relaxed">
        {message}
      </p>
    </div>
  );
}
