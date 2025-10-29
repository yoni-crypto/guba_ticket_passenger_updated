'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchPaymentOptions, processPayment, clearPaymentResponse } from '@/lib/redux/features/paymentSlice'
import { fetchTickets } from '@/lib/redux/features/ticketSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { CreditCard, Wallet, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { paymentOptions, loading, paymentLoading, paymentError, paymentResponse } = useAppSelector((state) => state.payment)
  const { tickets } = useAppSelector((state) => state.ticket)
  const paymentGuid = params.id as string
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [ticketInfo, setTicketInfo] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchPaymentOptions({ pageNumber: 1, pageSize: 10 }))
    dispatch(fetchTickets({ pageNumber: 1, pageSize: 100 }))
    return () => {
      dispatch(clearPaymentResponse())
    }
  }, [dispatch])

  useEffect(() => {
    if (tickets.length > 0) {
      const groupedTickets = tickets.filter((t) => t.booking.payment.paymentGuid === paymentGuid)
      if (groupedTickets.length > 0) {
        setTicketInfo(groupedTickets)
      }
    }
  }, [tickets, paymentGuid])

  useEffect(() => {
    if (paymentResponse) {
      console.log('Payment Response:', paymentResponse)
      const checkoutUrl = paymentResponse.checkoutUrl || paymentResponse.checkout_url || paymentResponse.data?.checkout_url
      if (checkoutUrl) {
        toast.success('Redirecting to payment gateway...')
        window.location.href = checkoutUrl
      } else {
        toast.success('Payment initiated successfully')
        router.push('/my-tickets')
      }
    }
  }, [paymentResponse, router])

  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError)
    }
  }, [paymentError])

  const handlePayment = async () => {
    if (!selectedOption) {
      toast.error('Please select a payment method')
      return
    }

    if (!user) {
      toast.error('Please login to continue')
      return
    }

    if (!ticketInfo) {
      toast.error('Ticket information not found')
      return
    }

    const firstTicket = ticketInfo[0]
    const totalAmount = firstTicket.booking.trip.travelPrice * ticketInfo.length

    const result = await dispatch(
      processPayment({
        paymentGuid,
        paymentOptionGuid: selectedOption,
        paymentAmount: totalAmount,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    )

    if (processPayment.rejected.match(result)) {
      toast.error(result.error.message || 'Payment failed')
    }
  }

  const chapaOption = paymentOptions.find((opt) => opt.code === 'CHAPA')

  if (loading || !ticketInfo) {
    return (
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
    )
  }

  const firstTicket = ticketInfo[0]
  const totalAmount = firstTicket.booking.trip.travelPrice * ticketInfo.length
  const passengerCount = ticketInfo.length

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer pt-20 lg:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 mb-6 transition"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-black mb-2">Complete Payment</h1>
            <p className="text-gray-600 mb-8">Choose your preferred payment method</p>

            <div className="mb-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">Trip</p>
                  <p className="font-semibold text-black">{firstTicket.booking.trip.busCarrier.displayName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-semibold text-black">{passengerCount} {passengerCount > 1 ? 'Passengers' : 'Passenger'}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Passenger Names:</p>
                <div className="flex flex-wrap gap-2">
                  {ticketInfo.map((ticket: any) => (
                    <span key={ticket.ticketGuid} className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-black">
                      {ticket.fullName}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-black">Total Amount</p>
                  <p className="text-3xl font-bold text-blue-500">{firstTicket.booking.trip.currency.symbol}{totalAmount}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {chapaOption && (
                <div
                  onClick={() => setSelectedOption(chapaOption.paymentOptionGuid)}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${
                    selectedOption === chapaOption.paymentOptionGuid
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      selectedOption === chapaOption.paymentOptionGuid ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <CreditCard className={`size-6 ${
                        selectedOption === chapaOption.paymentOptionGuid ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-1">{chapaOption.name}</h3>
                      <p className="text-gray-600 text-sm">{chapaOption.description}</p>
                    </div>
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === chapaOption.paymentOptionGuid
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === chapaOption.paymentOptionGuid && (
                        <div className="size-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentOptions.find((opt) => opt.code === 'CASH') && (
                <div className="border-2 border-gray-200 rounded-2xl p-6 opacity-50 cursor-not-allowed">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gray-100">
                      <Wallet className="size-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-400 mb-1">Cash Payment</h3>
                      <p className="text-gray-400 text-sm">Not available for online payments</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedOption || paymentLoading}
              className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
            >
              {paymentLoading ? 'Processing...' : `Pay ${firstTicket.booking.trip.currency.symbol}${totalAmount}`}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Your payment is secure and encrypted
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
