'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { searchTicketByPNR } from '@/lib/redux/features/ticketSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { CheckCircle } from 'lucide-react'

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { searchResults, searchLoading } = useAppSelector((state) => state.ticket)
  const [pnr, setPnr] = useState<string | null>(null)

  useEffect(() => {
    const pnrParam = searchParams.get('pnr')
    if (pnrParam) {
      setPnr(pnrParam)
      dispatch(searchTicketByPNR({ searchQuery: pnrParam, pageNumber: 1, pageSize: 1 }))
    }
  }, [searchParams, dispatch])

  const booking = searchResults[0]
  const isPaid = booking?.payment?.status?.toLowerCase() === 'paid'

  if (searchLoading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg">Checking payment status...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!booking) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <div className="text-center">
            <p className="text-red-600 mb-4">Booking not found</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer pt-20 lg:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {isPaid ? (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">Your payment has been processed successfully.</p>
                
                <div className="bg-gray-50 p-6 mb-8 text-left">
                  <h2 className="text-lg font-bold mb-4">Booking Details</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">PNR:</span> {booking.pnr}</p>
                    <p><span className="font-medium">Route:</span> {booking.trip.tripRoute.origin.city.name} → {booking.trip.tripRoute.destination.city.name}</p>
                    <p><span className="font-medium">Date:</span> {new Date(booking.trip.departureDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Time:</span> {booking.trip.departureTime}</p>
                    <p><span className="font-medium">Passengers:</span> {booking.tickets?.length || 0}</p>
                    <p><span className="font-medium">Amount:</span> {booking.trip.currency.symbol}{booking.trip.travelPrice * (booking.tickets?.length || 0)}</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push(`/ticket/${booking.bookingGuid}`)}
                    className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    View Ticket
                  </button>
                  <button
                    onClick={() => router.push('/my-tickets')}
                    className="px-6 py-3 border border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    My Tickets
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-red-500 text-3xl">✕</span>
                </div>
                <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
                <p className="text-gray-600 mb-8">Your payment could not be processed.</p>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push(`/payment/${booking.payment.paymentGuid}`)}
                    className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 border border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    Go Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <PaymentContent />
    </Suspense>
  )
}