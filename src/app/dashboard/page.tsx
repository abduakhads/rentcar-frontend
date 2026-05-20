'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { apiFetch } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RentedCar {
  brand: string;
  model: string;
  category: string;
  transmissionType: string;
  barcode: string;
  reservationNumber: string;
  memberName: string;
  dropoffDateTime: string;
  dropoffLocationCode: string;
  reservationDayCount: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [rentedCars, setRentedCars] = useState<RentedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchRentedCars();
    }
  }, [user, authLoading]);

  const fetchRentedCars = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/reservations/rented');
      if (res.ok) {
        const data = await res.json();
        setRentedCars(data);
      } else if (res.status === 404) {
        setRentedCars([]);
      } else {
        setError('Failed to fetch reservations.');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (reservationNumber: string) => {
    if (confirm('Are you sure you want to return this car?')) {
      const res = await apiFetch(`/api/reservations/${reservationNumber}/return`, { method: 'POST' });
      if (res.ok) {
        fetchRentedCars();
      } else {
        alert('Failed to return the car.');
      }
    }
  };

  const handleCancel = async (reservationNumber: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      const res = await apiFetch(`/api/reservations/${reservationNumber}/cancel`, { method: 'POST' });
      if (res.ok) {
        fetchRentedCars();
      } else {
        alert('Failed to cancel the reservation.');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-2">Active Reservations</h2>
          
          {rentedCars.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-100">
              <p className="text-gray-500 mb-4">You have no active reservations.</p>
              <Button onClick={() => router.push('/')}>
                Book a Car
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {rentedCars.map((item) => (
                <div key={item.reservationNumber} className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 uppercase">Reservation #{item.reservationNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold">{item.brand} {item.model}</h3>
                    <p className="text-sm text-gray-600">
                      Dropoff: <span className="font-medium">{new Date(item.dropoffDateTime).toLocaleString()}</span> at <span className="font-medium">{item.dropoffLocationCode}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: <span className="font-medium">{item.reservationDayCount} days</span>
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <Button variant="outline" onClick={() => handleCancel(item.reservationNumber)}>
                      Cancel
                    </Button>
                    <Button variant="secondary" onClick={() => handleReturn(item.reservationNumber)}>
                      Return Car
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
