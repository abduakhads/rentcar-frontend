'use client';

import React from 'react';
import { Button } from './Button';

interface CarCardProps {
  car: {
    barcode: string;
    brand: string;
    model: string;
    numberOfSeats: number;
    dailyPrice: number;
    category: string;
    transmissionType: string;
    status: string;
    imageUrl?: string;
  };
  onBookNow?: () => void;
  showBookButton?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onBookNow, showBookButton = true }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
      <div className="bg-gray-100 h-48 flex items-center justify-center relative overflow-hidden">
        {car.imageUrl ? (
          <img 
            src={car.imageUrl} 
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-gray-400">{car.brand} {car.model}</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-action-black">{car.brand} {car.model}</h3>
            <p className="text-sm text-gray-500">{car.category} • {car.transmissionType}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
            car.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {car.status}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
           <span>💺 {car.numberOfSeats} Seats</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div>
            <span className="text-2xl font-bold text-action-black">${car.dailyPrice}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
          {showBookButton && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={onBookNow}
              disabled={car.status !== 'AVAILABLE'}
            >
              Book Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
