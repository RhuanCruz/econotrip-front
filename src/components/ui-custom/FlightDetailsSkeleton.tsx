import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const FlightDetailsSkeleton = () => {
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-32">
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Skeleton className="w-8 h-8" />
            </motion.div>

            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </motion.div>

        {/* Card principal skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6 p-6 rounded-3xl shadow-xl bg-white/95 backdrop-blur-sm border-0">
            
            {/* Rota do voo skeleton */}
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-16 h-16 rounded-2xl mb-2" />
                </div>
                <div className="flex-1 relative flex items-center">
                  <div className="border-t-2 border-dashed border-gray-300 w-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <Skeleton className="w-12 h-12 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Skeleton className="w-16 h-16 rounded-2xl mb-2" />
                </div>
              </div>
              
              <div className="flex flex-col px-4 gap-4">
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-1" />
                  <Skeleton className="h-3 w-40 mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-1" />
                  <Skeleton className="h-3 w-40 mx-auto" />
                </div>
              </div>
            </div>

            {/* Detalhes do voo skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  variants={itemAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"
                >
                  <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Seção de preço skeleton */}
            <motion.div
              variants={itemAnimation}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.0 }}
              className="mt-8 border-t border-gray-200 pt-8"
            >
              <div className="mb-6 p-2 rounded-2xl">
                <Skeleton className="h-6 w-40 mb-4" />
                
                {[1, 2].map((index) => (
                  <div key={index} className="mb-4 p-4 bg-white rounded-xl shadow">
                    <div className="mb-3">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-40 mb-1" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Botão de ajuda skeleton */}
        <div className="fixed bottom-32 right-6 z-40">
          <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
