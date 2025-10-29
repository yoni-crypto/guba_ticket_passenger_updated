'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchTickets, searchTicketByPNR, clearSearchResults } from '@/lib/redux/features/ticketSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function MyTickets() {
  const dispatch = useAppDispatch()
  const { user, token } = useAppSelector((state) => state.auth)
  const { tickets, loading, pagination, searchResults, searchLoading, searchError } = useAppSelector((state) => state.ticket)
  const [pnrQuery, setPnrQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    if (token && user) {
      dispatch(fetchTickets({ pageNumber: 1, pageSize: 10, status: statusFilter }))
    }
  }, [dispatch, token, user, statusFilter])

  const handlePNRSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pnrQuery.trim()) {
      toast.error('Please enter a PNR code')
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
            <h1 className="text-4xl font-bold text-black mb-2">Search Your Ticket</h1>
            <p className="text-gray-600 mb-8">Enter your PNR code to view your booking details</p>

            <form onSubmit={handlePNRSearch} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pnrQuery}
                  onChange={(e) => setPnrQuery(e.target.value.toUpperCase())}
                  placeholder="Enter PNR Code (e.g., ABC123)"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
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
                  <h2 className="text-2xl font-bold text-black">Search Results</h2>
                  <button onClick={handleClearSearch} className="text-blue-500 hover:text-blue-600 font-medium">
                    Clear
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
                <p className="text-gray-600">No tickets found with this PNR code</p>
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
              <h1 className="text-4xl font-bold text-black mb-2">My Tickets</h1>
              <p className="text-gray-600">View and manage your bus tickets</p>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">No Tickets Found</h3>
              <p className="text-gray-600 mb-6">You haven't booked any tickets yet</p>
              <a href="/" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium">
                Search Trips
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                tickets.reduce((acc: any, ticket) => {
                  const pnr = ticket.booking.pnr
                  if (!acc[pnr]) {
                    acc[pnr] = []
                  }
                  acc[pnr].push(ticket)
                  return acc
                }, {})
              ).map(([pnr, groupedTickets]: [string, any]) => (
                <TicketCard key={pnr} tickets={groupedTickets} />
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(fetchTickets({ pageNumber: page, pageSize: 10, status: statusFilter }))}
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

function TicketCard({ tickets }: { tickets: any[] }) {
  const firstTicket = tickets[0]
  const { booking } = firstTicket
  const { trip } = booking
  const passengerCount = tickets.length
  const totalAmount = trip.travelPrice * passengerCount
  
  // Parse the date string format "Tuesday, October 28, 2025"
  const parseDepartureDate = (dateStr: string) => {
    try {
      const parts = dateStr.split(', ')
      if (parts.length >= 2) {
        return new Date(parts.slice(1).join(', '))
      }
      return new Date(dateStr)
    } catch {
      return new Date()
    }
  }
  
  const departureDate = parseDepartureDate(trip.departureDate)
  departureDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isExpired = departureDate.getTime() < today.getTime()
  const isUnpaid = booking.payment.status.toLowerCase() !== 'paid'
  const showPayButton = !isExpired && isUnpaid

  const handlePayNow = () => {
    window.location.href = `/payment/${booking.payment.paymentGuid}`
  }

  return (
    <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-black">{trip.busCarrier.displayName}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              firstTicket.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
              firstTicket.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {firstTicket.status}
            </span>
            {isUnpaid && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                {booking.payment.status}
              </span>
            )}
          </div>
          <p className="text-gray-600">PNR: {booking.pnr}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-500">{trip.currency.symbol}{totalAmount}</p>
          <p className="text-sm text-gray-600">{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">From</p>
          <p className="font-semibold text-black">{trip.tripRoute.origin.name}</p>
          <p className="text-sm text-gray-600">{trip.tripRoute.origin.city.name}</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <svg className="w-6 h-6 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <p className="text-sm text-gray-600">{trip.tripRoute.estimatedTravelTime}</p>
          </div>
        </div>
        <div className="text-right md:text-left">
          <p className="text-sm text-gray-600 mb-1">To</p>
          <p className="font-semibold text-black">{trip.tripRoute.destination.name}</p>
          <p className="text-sm text-gray-600">{trip.tripRoute.destination.city.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t-2 border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-600">Passengers</p>
            <p className="font-medium text-black">{tickets.map(t => t.fullName).join(', ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Departure</p>
            <p className="font-medium text-black">
              {trip.departureDate} at {trip.departureTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Contact</p>
            <p className="font-medium text-black">{firstTicket.phoneNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href={`/ticket/${firstTicket.ticketGuid}`}
            className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 font-medium transition-colors"
          >
            View Details
          </a>
          {showPayButton && (
            <button
              onClick={handlePayNow}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-colors"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking }: { booking: any }) {
  const { trip } = booking
  
  // Parse the date string format "Tuesday, October 28, 2025"
  const parseDepartureDate = (dateStr: string) => {
    try {
      const parts = dateStr.split(', ')
      if (parts.length >= 2) {
        return new Date(parts.slice(1).join(', '))
      }
      return new Date(dateStr)
    } catch {
      return new Date()
    }
  }
  
  const departureDate = parseDepartureDate(trip.departureDate)
  departureDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isExpired = departureDate.getTime() < today.getTime()
  const isUnpaid = booking.payment.status.toLowerCase() !== 'paid'
  const showPayButton = !isExpired && isUnpaid

  const handlePayNow = () => {
    window.location.href = `/payment/${booking.payment.paymentGuid}`
  }

  return (
    <div className="border-2 border-gray-200 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-black">{trip.busCarrier.displayName}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
              booking.payment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {booking.payment.status}
            </span>
          </div>
          <p className="text-gray-600">PNR: {booking.pnr}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-500">{trip.currency.symbol}{trip.travelPrice}</p>
          <p className="text-sm text-gray-600">{booking.tickets?.length || 0} Ticket(s)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">From</p>
          <p className="font-semibold text-black">{trip.tripRoute.origin.name}</p>
          <p className="text-sm text-gray-600">{trip.tripRoute.origin.city.name}</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <svg className="w-6 h-6 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <p className="text-sm text-gray-600">{trip.tripRoute.estimatedTravelTime}</p>
          </div>
        </div>
        <div className="text-right md:text-left">
          <p className="text-sm text-gray-600 mb-1">To</p>
          <p className="font-semibold text-black">{trip.tripRoute.destination.name}</p>
          <p className="text-sm text-gray-600">{trip.tripRoute.destination.city.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t-2 border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-600">Departure</p>
            <p className="font-medium text-black">
              {trip.departureDate} at {trip.departureTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bus</p>
            <p className="font-medium text-black">{trip.bus.plateNumber}</p>
          </div>
        </div>
        {showPayButton && (
          <button
            onClick={handlePayNow}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-colors"
          >
            Pay Now
          </button>
        )}
      </div>

      {booking.tickets && booking.tickets.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-gray-100">
          <p className="text-sm font-semibold text-black mb-2">Passengers:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {booking.tickets.map((ticket: any) => (
              <div key={ticket.ticketGuid} className="text-sm">
                <span className="font-medium text-black">{ticket.name}</span>
                <span className="text-gray-600"> - {ticket.ticketNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
