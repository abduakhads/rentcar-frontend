'use client';

import React from 'react';
import { Button } from './Button';

interface FilterModalProps {
  filters: {
    category: string;
    transmissionType: string;
    minPrice: string;
    maxPrice: string;
    minSeats: string;
  };
  setFilters: (filters: any) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ filters, setFilters, onClose }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFilters({
      category: '',
      transmissionType: '',
      minPrice: '',
      maxPrice: '',
      minSeats: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-action-black">Advanced Filters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              name="category"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">Any Category</option>
              <option value="Compact">Compact</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
              <option value="Minivan">Minivan</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Transmission</label>
            <select 
              name="transmissionType"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
              value={filters.transmissionType}
              onChange={handleChange}
            >
              <option value="">Any</option>
              <option value="AUTOMATIC">Automatic</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Min Price ($)</label>
            <input 
              name="minPrice"
              type="number"
              placeholder="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Max Price ($)</label>
            <input 
              name="maxPrice"
              type="number"
              placeholder="10000"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1 col-span-full">
            <label className="block text-sm font-medium text-gray-700">Min Seats</label>
            <input 
              name="minSeats"
              type="number"
              placeholder="2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-yellow focus:border-primary-yellow"
              value={filters.minSeats}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button variant="outline" fullWidth onClick={handleClear}>
            Clear All
          </Button>
          <Button fullWidth onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
