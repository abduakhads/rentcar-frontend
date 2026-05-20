'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { apiFetch } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  car: {
    barcode: string;
    brand: string;
    model: string;
    dailyPrice: number;
    locationCode: string;
  };
  searchParams: {
    pickupDate: string;
    dropoffDate: string;
  };
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ car, searchParams, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const body = {
        carBarcode: car.barcode,
        memberId: user.memberId,
        pickupDateTime: new Date(searchParams.pickupDate).toISOString(),
        dropoffDateTime: new Date(searchParams.dropoffDate).toISOString(),
        pickupLocationCode: car.locationCode,
        dropoffLocationCode: car.locationCode, // Simplified for prototype
        extraIds: [] // Optional: allow selection of extras
      };

      const res = await apiFetch('/api/reservations', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert('Booking successful!');
        router.push('/dashboard');
      } else {
        alert('Booking failed. Please check availability.');
      }
    } catch (err) {
      alert('An error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-action-black">Confirm Your Booking</h2>
        
        <div className="space-y-4 border-t border-b border-gray-100 py-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Car</span>
            <span className="font-bold">{car.brand} {car.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup</span>
            <span className="font-medium">{new Date(searchParams.pickupDate).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dropoff</span>
            <span className="font-medium">{new Date(searchParams.dropoffDate).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Daily Rate</span>
            <span className="font-bold">${car.dailyPrice}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button variant="outline" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleConfirm} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};
