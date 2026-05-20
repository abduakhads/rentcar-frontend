'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { apiFetch } from '@/services/api';
import { CarCard } from '@/components/CarCard';

interface Car {
  barcode: string;
  brand: string;
  model: string;
  numberOfSeats: number;
  dailyPrice: number;
  category: string;
  transmissionType: string;
  status: string;
  locationCode: string;
  imageUrl?: string;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/cars');
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      } else {
        setError('Failed to fetch cars.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-action-black py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our <span className="text-primary-yellow">Fleet</span>
          </h1>
          <p className="mt-3 text-base text-gray-300">
            Explore our wide range of premium vehicles available for rent.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && <p className="text-center py-10">Loading cars...</p>}
        {error && <p className="text-center text-red-500 font-medium py-10">{error}</p>}
        
        {!loading && !error && cars.length === 0 && (
          <p className="text-center text-gray-500 py-10">No cars found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard 
              key={car.barcode} 
              car={car} 
              showBookButton={false} // Just showing the fleet here
            />
          ))}
        </div>
      </div>
    </div>
  );
}
