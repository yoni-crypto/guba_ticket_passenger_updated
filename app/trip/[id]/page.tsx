'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { getTripDetails, clearTripDetails } from '@/lib/redux/features/tripSlice'
import { bookTicket } from '@/lib/redux/features/bookingSlice'
import { loadFromStorage } from '@/lib/redux/features/authSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { ArrowLeft, Wifi, Wind, Coffee, Bus, Heart, MoveUpRight, Plus, Minus, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { tripDetails, detailsLoading, detailsError } = useAppSelector((state) => state.trip)
  const { booking, loading: bookingLoading, error: bookingError } = useAppSelector((state) => state.booking)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  
  const tripId = params.id as string
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'booking' ? 'booking' : 'details')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [useMyInfo, setUseMyInfo] = useState(false)
  const [passengers, setPassengers] = useState([{
    firstName: '',
    lastName: '',
    countryCode: '+251',
    mobileNumber: '',
    email: ''
  }])

  const addPassenger = () => {
    setPassengers([...passengers, {
      firstName: '',
      lastName: '',
      countryCode: '+251',
      mobileNumber: '',
      email: ''
    }])
  }

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index))
    }
  }

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = passengers.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    )
    setPassengers(updated)
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets')
      setShowAuthModal(true)
      return
    }
    if (tripDetails) {
      const result = await dispatch(bookTicket({
        tripGuid: tripDetails.tripGuid,
        tickets: passengers
      }))
      if (bookTicket.fulfilled.match(result)) {
        toast.success('Booking successful!')
        router.push('/my-tickets')
      } else if (bookTicket.rejected.match(result)) {
        toast.error(result.error.message || 'Booking failed')
      }
    }
  }

  const isFormValid = passengers.every(p => 
    p.firstName.trim() && p.lastName.trim() && p.mobileNumber.trim()
  )

  useEffect(() => {
    dispatch(loadFromStorage())
    if (tripId) {
      dispatch(getTripDetails(tripId))
    }
    return () => {
      dispatch(clearTripDetails())
    }
  }, [dispatch, tripId])

  useEffect(() => {
    if (useMyInfo && user && passengers.length > 0) {
      setPassengers(prev => [
        {
          firstName: user.firstName,
          lastName: user.lastName,
          countryCode: user.countryCode,
          mobileNumber: user.mobileNumber,
          email: user.email
        },
        ...prev.slice(1)
      ])
    }
  }, [useMyInfo, user])

  if (detailsLoading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue/20 border-t-blue"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading trip details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (detailsError) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center font-switzer">
          <div className="p-6">
            <Bus className="size-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">Failed to Load Trip</h3>
            <p className="text-red-600 mb-6">{detailsError}</p>
            <button 
              onClick={() => router.back()}
              className="px-5 py-2 rounded-lg bg-blue text-white hover:bg-blue/90 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!tripDetails) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <h3 className="text-2xl font-medium text-black">Trip not found</h3>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer">
        {/* Hero Section */}
        <div className="bg-blue text-white pt-28 pb-16">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-white/80 mb-6 transition"
            >
              <ArrowLeft className="size-5" />
              <span className="font-medium">Back to Search</span>
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="grid size-20 place-content-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Bus className="size-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold mb-1 lg:text-4xl">
                    {tripDetails.busCarrier.displayName}
                  </h1>
                  <p className="text-white/80">{tripDetails.bus.plateNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold">{tripDetails.currency.symbol}{tripDetails.travelPrice}</p>
                <p className="text-white/70 text-sm">per person</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-6 pb-20">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white/20 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'details'
                  ? 'bg-white text-blue shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Trip Details
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                activeTab === 'booking'
                  ? 'bg-white text-blue shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Book Tickets ({passengers.length})
            </button>
          </div>

          {activeTab === 'details' ? (
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Route Details */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-black">Route Details</h2>
                  <span className="text-sm bg-blue/10 text-blue rounded-full px-4 py-1">
                    {tripDetails.tripRoute.estimatedTravelTime}
                  </span>
                </div>

                <div className="space-y-10">
                  {/* Departure */}
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center">
                      <div className="size-4 bg-green-600 rounded-full"></div>
                      <div className="w-0.5 h-20 bg-gray-200 mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">DEPARTURE</p>
                      <h3 className="text-xl font-semibold text-black">{tripDetails.tripRoute.origin.name}</h3>
                      <p className="text-gray-600">{tripDetails.tripRoute.origin.region?.name}</p>
                      <p className="text-sm text-gray-500">{tripDetails.tripRoute.origin.address}</p>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center">
                      <div className="size-4 bg-red-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-red-600 font-medium">ARRIVAL</p>
                      <h3 className="text-xl font-semibold text-black">{tripDetails.tripRoute.destination.name}</h3>
                      <p className="text-gray-600">{tripDetails.tripRoute.destination.region?.name}</p>
                      <p className="text-sm text-gray-500">{tripDetails.tripRoute.destination.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-2xl font-semibold text-black mb-4">Trip Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">DEPARTURE DATE</p>
                    <p className="text-lg font-semibold text-black">{tripDetails.departureDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">AVAILABLE SEATS</p>
                    <p className="text-lg font-semibold text-green-600">{tripDetails.seatAvailability.availableSeats} seats</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-2xl font-semibold text-black mb-4">Bus Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tripDetails.bus.amenities.hasWifi && (
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200">
                      <Wifi className="size-5 text-blue" />
                      <span className="font-medium text-black">Free WiFi</span>
                    </div>
                  )}
                  {tripDetails.bus.amenities.hasAC && (
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200">
                      <Wind className="size-5 text-blue" />
                      <span className="font-medium text-black">Air Conditioning</span>
                    </div>
                  )}
                  {tripDetails.bus.amenities.hasRefreshment && (
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200">
                      <Coffee className="size-5 text-blue" />
                      <span className="font-medium text-black">Refreshments</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-black">Booking Summary</h3>
                  <button className="grid size-9 place-content-center rounded-full border border-gray-200 text-gray-500 hover:text-blue">
                    <Heart className="size-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Trip Price</span>
                    <span className="font-medium text-black">{tripDetails.currency.symbol}{tripDetails.travelPrice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Available Seats</span>
                    <span className="font-medium text-green-600">{tripDetails.seatAvailability.availableSeats}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-lg font-semibold text-black">Total</span>
                    <span className="text-2xl font-bold text-blue">{tripDetails.currency.symbol}{tripDetails.travelPrice}</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('booking')}
                    className="w-full flex items-center justify-between bg-blue text-white px-6 py-4 rounded-xl text-lg font-medium hover:bg-blue/90 transition"
                  >
                    Book This Trip
                    <User className="size-6" />
                  </button>
                </div>
              </div>
            </div>

          </div>
          ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-black">Passenger Information</h2>
                  <p className="text-gray-600 mt-1">Fill details for all passengers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-blue">
                    {tripDetails?.currency.symbol}{(tripDetails?.travelPrice || 0) * passengers.length}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium text-black">
                          Passenger {index + 1}
                        </h3>
                        {index === 0 && isAuthenticated && (
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={useMyInfo}
                              onChange={(e) => setUseMyInfo(e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-600">Use my info</span>
                          </label>
                        )}
                      </div>
                      {passengers.length > 1 && (
                        <button
                          onClick={() => removePassenger(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Minus className="size-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="flex">
                          <select
                            value={passenger.countryCode}
                            onChange={(e) => updatePassenger(index, 'countryCode', e.target.value)}
                            className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                          >
                            <option value="+251">+251</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </select>
                          <input
                            type="tel"
                            value={passenger.mobileNumber}
                            onChange={(e) => updatePassenger(index, 'mobileNumber', e.target.value)}
                            className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addPassenger}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue hover:text-blue transition-colors"
                >
                  <Plus className="size-5" />
                  Add Another Passenger
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setActiveTab('details')}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back to Details
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={!isFormValid || bookingLoading}
                    className="flex-1 py-3 px-6 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {bookingLoading ? 'Booking...' : `Book ${passengers.length} Ticket${passengers.length > 1 ? 's' : ''}`}
                  </button>
                </div>
                {bookingError && (
                  <p className="text-red-600 text-sm mt-2">{bookingError}</p>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <Footer />
    </>
  )
}
