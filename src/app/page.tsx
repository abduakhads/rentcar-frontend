'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { apiFetch } from '@/services/api';
import { BookingModal } from '@/components/BookingModal';
import { CarCard } from '@/components/CarCard';
import { FilterModal } from '@/components/FilterModal';

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

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    pickupLocation: 'IST-AIR',
    pickupDate: '',
    dropoffDate: '',
    category: '',
    transmissionType: '',
    minPrice: '',
    maxPrice: '',
    minSeats: '',
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCars([]);

    try {
      const params: any = {
        pickupLocation: searchParams.pickupLocation,
        pickupDate: new Date(searchParams.pickupDate).toISOString(),
        dropoffDate: new Date(searchParams.dropoffDate).toISOString(),
      };

      if (searchParams.category) params.category = searchParams.category;
      if (searchParams.transmissionType) params.transmissionType = searchParams.transmissionType;
      if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
      if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;
      if (searchParams.minSeats) params.minSeats = searchParams.minSeats;

      const queryParams = new URLSearchParams(params).toString();

      const res = await apiFetch(`/api/cars/search?${queryParams}`);
      
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      } else if (res.status === 404) {
        setError('No cars available for the selected criteria.');
      } else {
        setError('Failed to fetch cars. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-action-black py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Find Your <span className="text-primary-yellow">Perfect</span> Ride
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Premium car rentals at your fingertips. Simple, fast, and reliable.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
                value={searchParams.pickupLocation}
                onChange={(e) => setSearchParams({...searchParams, pickupLocation: e.target.value})}
              >
                <option value="IST-AIR">Istanbul (IST-AIR)</option>
                <option value="SAW-AIR">Sabiha (SAW-AIR)</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <input 
                type="datetime-local" 
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
                value={searchParams.pickupDate}
                onChange={(e) => setSearchParams({...searchParams, pickupDate: e.target.value})}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Date</label>
              <input 
                type="datetime-local" 
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
                value={searchParams.dropoffDate}
                onChange={(e) => setSearchParams({...searchParams, dropoffDate: e.target.value})}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full md:w-auto h-[42px] px-8">
              {loading ? '...' : 'Search'}
            </Button>
            <button 
              type="button" 
              className="w-full md:w-[42px] h-[42px] flex items-center justify-center rounded-md border-2 border-action-black text-action-black hover:bg-gray-100 transition-colors relative"
              onClick={() => setShowFilters(true)}
              title="Advanced Filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              {Object.values({
                category: searchParams.category,
                transmissionType: searchParams.transmissionType,
                minPrice: searchParams.minPrice,
                maxPrice: searchParams.maxPrice,
                minSeats: searchParams.minSeats
              }).filter(Boolean).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-yellow text-action-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
                  {Object.values({
                    category: searchParams.category,
                    transmissionType: searchParams.transmissionType,
                    minPrice: searchParams.minPrice,
                    maxPrice: searchParams.maxPrice,
                    minSeats: searchParams.minSeats
                  }).filter(Boolean).length}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && <p className="text-center text-red-500 font-medium">{error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard 
              key={car.barcode} 
              car={car} 
              onBookNow={() => setSelectedCar(car)} 
            />
          ))}
        </div>
      </div>

      {selectedCar && (
        <BookingModal 
          car={selectedCar} 
          searchParams={searchParams} 
          onClose={() => setSelectedCar(null)} 
        />
      )}

      {showFilters && (
        <FilterModal 
          filters={searchParams}
          setFilters={(newFilters) => setSearchParams({...searchParams, ...newFilters})}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
