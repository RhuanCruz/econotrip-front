import React from "react";
import { Card } from "@/components/ui-custom/Card";
import { Skeleton } from "@/components/ui/skeleton";

export function FlightResultSkeleton() {
  return (
    <Card className="overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl border-0">
      <div className="p-3 sm:p-1">
        {/* Header do voo - nome e preço */}
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="w-12 h-12 rounded-2xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="mt-2 text-left">
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Horários */}
        <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">
          <div className="flex items-center justify-between">
            {/* Origem */}
            <div className="text-center">
              <Skeleton className="h-6 w-16 mb-2 mx-auto" />
              <Skeleton className="h-5 w-12 mb-1 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            
            {/* Linha de voo */}
            <div className="flex-1 px-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-full mb-2">
                  <div className="flex-1 border-t-2 border-dashed border-gray-200"></div>
                  <Skeleton className="w-12 h-12 rounded-full mx-2" />
                  <div className="flex-1 border-t-2 border-dashed border-gray-200"></div>
                </div>
                <div className="text-center">
                  <Skeleton className="h-4 w-16 mb-1 mx-auto" />
                  <Skeleton className="h-3 w-12 mx-auto" />
                </div>
              </div>
            </div>
            
            {/* Destino */}
            <div className="text-center">
              <Skeleton className="h-6 w-16 mb-2 mx-auto" />
              <Skeleton className="h-5 w-12 mb-1 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Botão */}
        <Skeleton className="w-full h-14 rounded-2xl" />
      </div>
    </Card>
  );
}
