import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function MeusRadaresSkeleton() {
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 pb-28">
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-11 w-11 rounded-full" />
      </motion.div>

      {/* Radar Cards Skeleton */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="space-y-4"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={`radar-skeleton-${index}`}
            variants={itemAnimation}
            className="w-full bg-white rounded-xl shadow-md p-5 border border-gray-100"
          >
            {/* Header with remove button */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>

            {/* Period info */}
            <div className="mb-2">
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Additional info */}
            <div>
              <Skeleton className="h-3 w-24" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
