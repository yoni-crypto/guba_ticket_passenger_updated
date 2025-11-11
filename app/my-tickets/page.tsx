'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchBookings, searchTicketByPNR, clearSearchResults } from '@/lib/redux/features/ticketSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function MyTickets() {
  const { t } = useTranslation('pages')
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { bookings, loading, pagination, searchResults, searchLoading, searchError } = useAppSelector((state) => state.ticket)
  const [pnrQuery, setPnrQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (token && user) {
      dispatch(fetchBookings({ pageNumber: 1, pageSize: 10, status: statusFilter }))
    }
  }, [dispatch, token, user, statusFilter])

  const handlePNRSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pnrQuery.trim()) {
      dispatch(clearSearchResults())
      return
    }
    dispatch(searchTicketByPNR({ searchQuery: pnrQuery, pageNumber: 1, pageSize: 10 }))
  }

  const handleClearSearch = () => {
    setPnrQuery('')
    dispatch(clearSearchResults())
  }

  if (!token || !user) {
    return (
      <div className="font-switzer text-gray flex min-h-screen flex-col bg-white text-base font-normal antialiased">
        <NavBar />
        <main className="flex-1 pt-20 lg:pt-32">
          <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-4xl font-bold text-black mb-2">{t('tickets.searchYourTicket')}</h1>
            <p className="text-gray-600 mb-8">{t('tickets.enterPNR')}</p>

            <form onSubmit={handlePNRSearch} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pnrQuery}
                  onChange={(e) => setPnrQuery(e.target.value.toUpperCase())}
                  placeholder={t('tickets.pnrPlaceholder')}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {searchLoading ? t('tickets.searching') : t('tickets.search')}
                </button>
              </div>
            </form>

            {searchError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-600">{searchError}</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-black">{t('tickets.searchResults')}</h2>
                  <button onClick={handleClearSearch} className="text-blue-500 hover:text-blue-600 font-medium">
                    {t('tickets.clear')}
                  </button>
                </div>
                <div className="space-y-4">
                  {searchResults.map((booking) => (
                    <BookingCard key={booking.pnr} booking={booking} />
                  ))}
                </div>
              </div>
            )}

            {!searchLoading && searchResults.length === 0 && pnrQuery && !searchError && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600">{t('tickets.noTicketsFound')}</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="font-switzer text-gray flex min-h-screen flex-col bg-white text-base font-normal antialiased">
      <NavBar />
      <main className="flex-1 pt-20 lg:pt-32">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{t('tickets.myTickets')}</h1>
              <p className="text-gray-600">{t('tickets.viewManage')}</p>
            </div>
            <div className="flex gap-3">
              <form onSubmit={handlePNRSearch} className="flex gap-2">
                <input
                  type="text"
                  value={pnrQuery}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    setPnrQuery(value)
                    if (!value.trim()) {
                      dispatch(clearSearchResults())
                    }
                  }}
                  placeholder={t('tickets.searchByPNR')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {searchLoading ? t('tickets.searching') : t('tickets.search')}
                </button>
              </form>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue bg-white"
              >
                <option value="">{t('tickets.allTickets')}</option>
                <option value="PENDING">{t('tickets.pending')}</option>
                <option value="CANCELLED">{t('tickets.cancelled')}</option>
                <option value="EXPIRED">{t('tickets.expired')}</option>
                <option value="BOOKED">{t('tickets.booked')}</option>
                <option value="READY">{t('tickets.ready')}</option>
                <option value="BOARDED">{t('tickets.boarded')}</option>
                <option value="NOSHOW">{t('tickets.noShow')}</option>
              </select>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">{t('tickets.searchResults')}</h2>
                <button onClick={handleClearSearch} className="text-blue-500 hover:text-blue-600 font-medium">
                  {t('tickets.clearSearch')}
                </button>
              </div>
              <div className="grid gap-6">
                {searchResults.map((booking) => (
                  <BookingCard key={booking.pnr} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {searchError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{searchError}</p>
            </div>
          )}

          {searchResults.length === 0 && (
            <>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">{t('tickets.loadingTickets')}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">{t('tickets.noTicketsFoundTitle')}</h3>
                  <p className="text-gray-600 mb-6">{t('tickets.noTicketsYet')}</p>
                  <a href="/" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium">
                    {t('tickets.searchTrips')}
                  </a>
                </div>
              ) : (
                <div className="grid gap-6">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.bookingGuid} booking={booking} />
                  ))}
                </div>
              )}
            </>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(fetchBookings({ pageNumber: page, pageSize: 10, status: statusFilter }))}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === pagination.currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}



function BookingCard({ booking }: { booking: any }) {
  const { t } = useTranslation('pages')
  const { trip } = booking
  const totalAmount = trip.travelPrice * booking.tickets.length
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPolicies, setShowPolicies] = useState(false)
  
  const isExpired = booking.status?.toLowerCase() === 'expired'
  const isUnpaid = booking.payment.status.toLowerCase() !== 'paid'
  const showPayButton = !isExpired && isUnpaid
  const [timeLeft, setTimeLeft] = useState<string>('')

  const handlePayNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    window.location.href = `/payment/${booking.payment.paymentGuid}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Calculate payment countdown based on booking date and carrier's maxPaymentMinutes
  useEffect(() => {
    if (!isUnpaid || isExpired || !trip.busCarrier.setting?.maxPaymentMinutes) {
      setTimeLeft('')
      return
    }

    const updateTimer = () => {
      // Step 1: Get booking date
      const bookingTime = new Date(booking.bookingDate)
      
      // Step 2: Get current time
      const currentTime = new Date()
      
      // Step 3: Get max payment minutes from carrier setting
      const maxPaymentMinutes = trip.busCarrier.setting.maxPaymentMinutes
      
      // Step 4: Calculate how many minutes have passed since booking
      const minutesPassed = Math.floor((currentTime.getTime() - bookingTime.getTime()) / (1000 * 60))
      
      // Step 5: Check if time left
      if (minutesPassed >= maxPaymentMinutes) {
        setTimeLeft('0:00')
        return
      }
      
      // Step 6: Calculate remaining time
      const minutesLeft = maxPaymentMinutes - minutesPassed
      const secondsPassed = Math.floor((currentTime.getTime() - bookingTime.getTime()) / 1000) % 60
      const secondsLeft = 60 - secondsPassed
      
      if (secondsLeft === 60) {
        setTimeLeft(`${minutesLeft}:00`)
      } else {
        setTimeLeft(`${minutesLeft - 1}:${secondsLeft.toString().padStart(2, '0')}`)
      }
    }

    // Update immediately
    updateTimer()
    
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [isUnpaid, isExpired, booking.bookingDate, trip.busCarrier.setting?.maxPaymentMinutes])

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
              {trip.busCarrier.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{trip.busCarrier.displayName}</h3>
                {trip.busCarrier.setting && (
                  <button
                    onClick={() => setShowPolicies(!showPolicies)}
                    className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600"
                    title="View carrier policies"
                  >
                    i
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 font-mono">{booking.pnr}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{trip.currency.symbol}{totalAmount.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{booking.tickets.length} {booking.tickets.length === 1 ? t('tickets.passenger') : t('tickets.passengers')}</p>
          </div>
        </div>
      </div>

      {/* Route */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">From</p>
            <p className="text-lg font-semibold text-gray-900">{trip.tripRoute.origin.city.name}</p>
            <p className="text-sm text-gray-600">{trip.tripRoute.origin.name}</p>
          </div>
          
          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center w-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-3 relative">
                <div className="absolute inset-0 bg-blue-600 w-1/2"></div>
              </div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{trip.tripRoute.estimatedTravelTime}</p>
          </div>
          
          <div className="flex-1 text-right">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">To</p>
            <p className="text-lg font-semibold text-gray-900">{trip.tripRoute.destination.city.name}</p>
            <p className="text-sm text-gray-600">{trip.tripRoute.destination.name}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t('tickets.from')}</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(trip.departureDate)}</p>
            <p className="text-sm text-gray-600">{trip.departureTime}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t('tickets.passenger')}</p>
            <p className="text-sm font-semibold text-gray-900">{booking.tickets[0]?.fullName}</p>
            {booking.tickets.length > 1 && (
              <p className="text-sm text-gray-600">+{booking.tickets.length - 1} more</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t('tickets.contact')}</p>
            <p className="text-sm font-semibold text-gray-900">{booking.tickets[0]?.phoneNumber}</p>
          </div>
        </div>
        
        {trip.busCarrier.setting && showPolicies && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t('tickets.carrierPolicies')}</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('tickets.paymentWindow')}:</span>
                <span className="font-medium">{trip.busCarrier.setting.maxPaymentMinutes} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('tickets.cancellationFee')}:</span>
                <span className="font-medium">{trip.busCarrier.setting.cancellationFeePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('tickets.refunds')}:</span>
                <span className={`font-medium ${trip.busCarrier.setting.allowRefunds ? 'text-green-600' : 'text-red-600'}`}>
                  {trip.busCarrier.setting.allowRefunds ? t('tickets.allowed') : t('tickets.notAllowed')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('tickets.cancellation')}:</span>
                <span className={`font-medium ${trip.busCarrier.setting.allowTicketCancellation ? 'text-green-600' : 'text-red-600'}`}>
                  {trip.busCarrier.setting.allowTicketCancellation ? t('tickets.allowed') : t('tickets.notAllowed')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status & Actions */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold ${
            booking.status === 'BOOKED' ? 'bg-green-100 text-green-800' :
            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
            booking.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {booking.status}
          </span>
          <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold ${
            booking.payment.status.toLowerCase() === 'paid' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {booking.payment.status.toLowerCase() === 'paid' ? t('tickets.paymentCompleted') : t('tickets.paymentPending')}
          </span>
          {isUnpaid && !isExpired && timeLeft && timeLeft !== '0:00' && (
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-800">
              {t('tickets.payWithin')} {timeLeft}
            </span>
          )}
          {isUnpaid && !isExpired && timeLeft === '0:00' && (
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-red-100 text-red-800">
              {t('tickets.payWithin')} {timeLeft}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuthModal(true)
                return
              }
              window.location.href = `/ticket/${booking.bookingGuid}`
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('tickets.viewDetails')}
          </button>
          {showPayButton && (
            <button
              onClick={handlePayNow}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('tickets.payNow')}
            </button>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}
