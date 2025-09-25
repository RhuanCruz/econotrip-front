import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function RoundTripFlightDetailsSkeleton() {
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <div className="max-w-screen-sm mx-auto px-4 py-4 pb-32">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          
          <div className="text-center mb-6">
            <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-4" />
            <Skeleton className="h-8 w-56 mx-auto mb-2" />
            <Skeleton className="h-4 w-36 mx-auto" />
          </div>
        </motion.div>

        {/* Summary Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-0 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Skeleton className="h-4 w-16 mx-auto mb-1" />
              <Skeleton className="h-5 w-20 mx-auto" />
            </div>
            <div className="text-center">
              <Skeleton className="h-4 w-16 mx-auto mb-1" />
              <Skeleton className="h-5 w-20 mx-auto" />
            </div>
          </div>
        </motion.div>

        {/* Outbound Flight Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border-0 mb-6"
        >
          <div className="p-6">
            {/* Flight header */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Flight route */}
            <div className="p-4 bg-gradient-to-r from-blue-50/50 to-gray-50/50 rounded-2xl mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-5 w-8 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                
                <div className="flex-1 px-4">
                  <div className="flex items-center justify-center w-full mb-2">
                    <Skeleton className="h-0.5 w-full" />
                    <Skeleton className="w-8 h-8 rounded-full mx-2" />
                    <Skeleton className="h-0.5 w-full" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </div>
                
                <div className="text-center">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-5 w-8 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            </div>

            {/* Flight details */}
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={`outbound-${index}`}
                  variants={itemAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Return Flight Card Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border-0 mb-6"
        >
          <div className="p-6">
            {/* Flight header */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Flight route */}
            <div className="p-4 bg-gradient-to-r from-orange-50/50 to-gray-50/50 rounded-2xl mb-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-5 w-8 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                
                <div className="flex-1 px-4">
                  <div className="flex items-center justify-center w-full mb-2">
                    <Skeleton className="h-0.5 w-full" />
                    <Skeleton className="w-8 h-8 rounded-full mx-2" />
                    <Skeleton className="h-0.5 w-full" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                </div>
                
                <div className="text-center">
                  <Skeleton className="h-6 w-12 mb-1" />
                  <Skeleton className="h-5 w-8 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            </div>

            {/* Flight details */}
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <motion.div
                  key={`return-${index}`}
                  variants={itemAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Baggage and Policies Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border-0 mb-6"
        >
          <div className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((index) => (
                <motion.div
                  key={`baggage-${index}`}
                  variants={itemAnimation}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Skeleton className="w-full h-14 rounded-2xl" />
          <Skeleton className="w-full h-12 rounded-2xl" />
        </motion.div>
      </div>
    </div>
  );
}
