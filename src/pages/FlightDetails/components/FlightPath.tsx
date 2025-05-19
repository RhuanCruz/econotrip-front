
import React from "react";

interface FlightPathProps {
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
}

export function FlightPath({ origin, originCode, destination, destinationCode }: FlightPathProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-4 bg-gray-50 rounded-xl">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
              <span className="font-bold text-xs">BR</span>
            </div>
            <span className="text-xs font-medium">{originCode}</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300 relative h-6">
            <Plane className="h-5 w-5 text-econotrip-blue absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mb-1 overflow-hidden flex items-center justify-center">
              <span className="font-bold text-xs">PT</span>
            </div>
            <span className="text-xs font-medium">{destinationCode}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-between px-2">
          <div className="text-center">
            <h3 className="font-medium text-econotrip-blue">{origin}</h3>
          </div>
          <div className="text-center">
            <h3 className="font-medium text-econotrip-blue">{destination}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
