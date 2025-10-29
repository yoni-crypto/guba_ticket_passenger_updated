'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { searchTrips } from '@/lib/redux/features/tripSlice';
import { fetchBusCarriers } from '@/lib/redux/features/busCarrierSlice';
import {
  Bus,
  Clock,
  MapPin,
  Wifi,
  Wind,
  Coffee,
  Search,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function SearchResults() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { trips, loading, error } = useAppSelector((state) => state.trip);
  const { busCarriers } = useAppSelector((state) => state.busCarrier);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [carrierSearch, setCarrierSearch] = useState<string>('');
  const router = useRouter();

  const handleViewDetails = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  const originGuid = searchParams.get('origin');
  const destinationGuid = searchParams.get('destination');
  const travelDate = searchParams.get('date');

  useEffect(() => {
    dispatch(fetchBusCarriers({ searchKeyword: carrierSearch }));
  }, [dispatch, carrierSearch]);

  useEffect(() => {
    if (originGuid && destinationGuid && travelDate) {
      dispatch(
        searchTrips({
          originGuid,
          destinationGuid,
          travelDate,
          pageSize: 50,
          busCarrierGuid: selectedCarrier || undefined,
        })
      );
    }
  }, [dispatch, originGuid, destinationGuid, travelDate, selectedCarrier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue/20 border-t-blue"></div>
            <p className="mt-6 text-xl text-gray-600">
              Searching for available trips...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <div className="mx-auto mb-6 grid size-20 place-content-center rounded-full bg-red-100 text-red-600">
              <Bus className="size-10" />
            </div>
            <h3 className="text-2xl font-medium text-black mb-4">
              Search Error
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-switzer">
      {/* Hero */}
      <div className="relative bg-blue pt-72 pb-40 lg:pt-80">
        <Image
          src="https://images.unsplash.com/photo-1624314138470-5a2f24623f10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWRkaXMlMjBhYmFiYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000"
          alt="search background"
          fill
          className="object-cover"
          priority
        />
        <span className="absolute inset-0 bg-black/40"></span>
        <div className="relative z-20">
          <SearchForm />
        </div>
      </div>

      {/* Results */}
      <div className="relative z-10 container mx-auto px-4 -mt-40 pb-20 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="mb-8 lg:mb-12">
            {originGuid && destinationGuid && travelDate && (
              <>
                <span className="bg-white/20 text-white inline-block rounded-full px-3 py-1.5 text-sm lg:px-4 lg:py-2.5 lg:text-lg">
                  Search Results
                </span>
                <h1 className="mt-4 text-3xl font-medium text-white sm:text-4xl">
                  Available <span className="italic">Trips</span>
                </h1>
                <p className="text-white mt-2">
                  {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
                </p>
              </>
            )}
          </div>

          {/* No Params */}
          {!originGuid || !destinationGuid || !travelDate ? (
            <div className="text-center py-20 border border-gray-200 rounded-3xl bg-white">
              <div className="mx-auto mb-6 grid size-20 place-content-center rounded-full bg-blue/10 text-blue">
                <Bus className="size-10" />
              </div>
              <h3 className="text-2xl font-medium text-black mb-4">
                Start Your Search
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Please enter origin, destination, and departure date to search
                for available trips.
              </p>
            </div>
          ) : trips.length === 0 ? (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Filter Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-4">
                  <h3 className="font-medium text-gray-900 mb-4">Filter by Bus Carrier</h3>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search carriers..."
                      value={carrierSearch}
                      onChange={(e) => setCarrierSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="h-80 overflow-y-auto space-y-2 pr-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="carrier"
                        value=""
                        checked={selectedCarrier === ''}
                        onChange={(e) => setSelectedCarrier(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">All Carriers</span>
                    </label>
                    {busCarriers.map((carrier) => (
                      <label
                        key={carrier.busCarrierGuid}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="carrier"
                          value={carrier.busCarrierGuid}
                          checked={selectedCarrier === carrier.busCarrierGuid}
                          onChange={(e) => setSelectedCarrier(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                          {carrier.displayName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty Results */}
              <div className="lg:col-span-3">
                <div className="text-center py-20 border border-gray-200 rounded-3xl bg-white">
                  <div className="mx-auto mb-6 grid size-20 place-content-center rounded-full bg-blue/10 text-blue">
                    <Bus className="size-10" />
                  </div>
                  <h3 className="text-2xl font-medium text-black mb-4">
                    No trips found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We couldn’t find any trips matching your search criteria.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Trips Found
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Filter Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-4">
                  <h3 className="font-medium text-gray-900 mb-4">Filter by Bus Carrier</h3>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search carriers..."
                      value={carrierSearch}
                      onChange={(e) => setCarrierSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="h-80 overflow-y-auto space-y-2 pr-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="carrier"
                        value=""
                        checked={selectedCarrier === ''}
                        onChange={(e) => setSelectedCarrier(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">All Carriers</span>
                    </label>
                    {busCarriers.map((carrier) => (
                      <label
                        key={carrier.busCarrierGuid}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="carrier"
                          value={carrier.busCarrierGuid}
                          checked={selectedCarrier === carrier.busCarrierGuid}
                          onChange={(e) => setSelectedCarrier(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">
                          {carrier.displayName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trip Results */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                {trips.map((trip) => (
                  <div
                    key={trip.tripGuid}
                    className="border border-gray-200 rounded-xl p-5 sm:p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 grid place-content-center rounded-lg border border-gray-200 bg-white">
                          <Bus className="text-blue-600 size-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {trip.busCarrier.displayName}
                          </h3>
                          <p className="text-sm text-gray-500">{trip.bus.plateNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Departure</p>
                        <p className="text-sm font-medium text-gray-900">{trip.departureDate}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Route */}
                    <div className="relative">
                      <div className="grid sm:grid-cols-3 gap-4 text-sm items-center">
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-1.5">
                            <MapPin className="size-4 text-blue-600" /> {trip.tripRoute.origin.name}
                          </p>
                          <p className="text-gray-500">{trip.tripRoute.origin.region?.name}</p>
                        </div>
                        <div className="flex items-center justify-center text-gray-600">
                          <Clock className="size-4 text-blue-600 mr-1" />
                          {trip.tripRoute.estimatedTravelTime}
                        </div>
                        <div className="text-right sm:text-left">
                          <p className="font-medium text-gray-900 flex items-center gap-1.5 justify-end sm:justify-start">
                            <MapPin className="size-4 text-blue-600" /> {trip.tripRoute.destination.name}
                          </p>
                          <p className="text-gray-500">{trip.tripRoute.destination.region?.name}</p>
                        </div>
                      </div>
                      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
                        <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" className="block">
                          <path
                            d="M5 10 L15 5 L25 15 L35 5 L45 15 L55 5 L65 15 L75 5 L85 15 L95 10"
                            stroke="#3b82f6"
                            strokeWidth="0.5"
                            fill="none"
                            strokeDasharray="2,2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    </div>

                    {trip.tripRoute.drops?.length > 0 && (
                      <div className="mt-3 text-sm">
                        <p className="text-gray-500 mb-1">Stops</p>
                        <div className="flex flex-wrap gap-2">
                          {trip.tripRoute.drops.map((drop: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-full border border-gray-200 text-gray-700 bg-white"
                            >
                              {drop.station.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-100 mt-4 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap gap-2 text-sm">
                        {trip.bus.amenities.hasWifi && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1">
                            <Wifi className="size-4 text-blue-600" /> Wi-Fi
                          </span>
                        )}
                        {trip.bus.amenities.hasAC && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1">
                            <Wind className="size-4 text-blue-600" /> A/C
                          </span>
                        )}
                        {trip.bus.amenities.hasRefreshment && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1">
                            <Coffee className="size-4 text-blue-600" /> Refreshment
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {trip.currency.symbol}
                            {trip.travelPrice}
                          </p>
                          <p className="text-xs text-gray-500">
                            {trip.seatAvailability.availableSeats} seats
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDetails(trip.tripGuid)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
                          >
                            View Details
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-150 text-sm font-medium">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue/20 border-t-blue"></div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
