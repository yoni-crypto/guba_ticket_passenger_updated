'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchTicketDetail, clearTicketDetail, confirmSeat } from '@/lib/redux/features/ticketSlice'
import { getTripDetails } from '@/lib/redux/features/tripSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { QRCodeSVG } from 'qrcode.react'
import { Download, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image-more'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { ticketDetail, detailLoading, detailError, seatConfirming } = useAppSelector((state) => state.ticket)
  const { tripDetails } = useAppSelector((state) => state.trip)
  const ticketRef = useRef<HTMLDivElement>(null)
  const ticketId = params.id as string
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTicketDetail(ticketId))
    }
    return () => {
      dispatch(clearTicketDetail())
    }
  }, [dispatch, ticketId])

  useEffect(() => {
    if (ticketDetail) dispatch(getTripDetails(ticketDetail.booking.trip.tripGuid))
  }, [dispatch, ticketDetail])

  const handleDownloadPDF = async () => {
    const ticketElement = ticketRef.current
    if (!ticketElement) {
      toast.error('Ticket not found.')
      return
    }

    setDownloading(true)
    try {
      const scale = 2
      const dataUrl = await domtoimage.toPng(ticketElement, {
        quality: 1,
        width: ticketElement.clientWidth * scale,
        height: ticketElement.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${ticketElement.clientWidth}px`,
          height: `${ticketElement.clientHeight}px`,
        },
      })

      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`ticket-${ticketDetail?.booking?.pnr || 'ticket'}.pdf`)

      toast.success('🎟️ Ticket downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download ticket.')
    } finally {
      setDownloading(false)
    }
  }

  const handleSeatConfirm = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat')
      return
    }

    const result = await dispatch(confirmSeat({ ticketGuid: ticketId, tripSeatGuid: selectedSeat }))
    if (confirmSeat.fulfilled.match(result)) {
      toast.success('Seat confirmed successfully')
      dispatch(fetchTicketDetail(ticketId))
      dispatch(getTripDetails(ticketDetail!.booking.trip.tripGuid))
    } else {
      toast.error('Failed to confirm seat')
    }
  }

  if (detailLoading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading ticket details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (detailError || !ticketDetail) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-white flex items-center justify-center font-switzer">
          <div className="text-center">
            <p className="text-red-600 mb-4">{detailError || 'Ticket not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const { booking, status } = ticketDetail
  const { trip, payment, pnr } = booking
  const isPaid = payment.status.toLowerCase() === 'paid'
  const qrData = `PNR:${pnr}|TICKET:${ticketDetail.ticketGuid}|TRIP:${trip.code}|DATE:${trip.departureDate}`

  const seatsByRow =
    tripDetails?.seatAvailability?.seats?.reduce((acc: any, seat: any) => {
      if (!acc[seat.rowNumber]) acc[seat.rowNumber] = []
      acc[seat.rowNumber].push(seat)
      return acc
    }, {}) || {}

  Object.keys(seatsByRow).forEach((row) =>
    seatsByRow[row].sort((a: any, b: any) => a.columnNumber - b.columnNumber)
  )

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white font-switzer pt-20 lg:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back to My Tickets</span>
          </button>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-[2fr_1fr] gap-8">
            {/* Ticket Section */}
            <div>
              <div
                ref={ticketRef}
                id="ticket-section"
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md relative"
                style={{
                  backgroundImage: 'linear-gradient(135deg,#ffffff 70%,#f3f6ff 100%)',
                  padding: '1.5rem',
                }}
              >
                <div className="bg-blue-500 p-6 flex justify-between items-center rounded-t-xl">
                  <h1 className="text-2xl font-bold text-white">{trip.busCarrier.displayName}</h1>
                  <div
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      isPaid ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-900'
                    }`}
                  >
                    {payment.status}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Route */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">From</p>
                      <h2 className="text-2xl font-bold text-gray-900">{trip.tripRoute.origin.city.name}</h2>
                      <p className="text-sm text-gray-600">{trip.tripRoute.origin.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{trip.departureDate}</p>
                      <p className="text-sm font-semibold text-blue-600">{trip.departureTime}</p>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <svg
                        className="w-8 h-8 text-blue-500 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <p className="text-xs text-gray-500 text-center">
                        {trip.tripRoute.estimatedTravelTime}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase mb-1">To</p>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {trip.tripRoute.destination.city.name}
                      </h2>
                      <p className="text-sm text-gray-600">{trip.tripRoute.destination.name}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-gray-50 rounded-xl p-5 grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Bus Number</p>
                      <p className="text-base font-semibold">{trip.bus.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Ticket Status</p>
                      <p
                        className={`text-base font-semibold ${
                          status === 'Confirmed'
                            ? 'text-green-600'
                            : status === 'Cancelled'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">PNR</p>
                      <p className="text-base font-semibold">{pnr}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Ticket Number</p>
                      <p className="text-base font-semibold">{ticketDetail.ticketNumber || 'N/A'}</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4">
                      <QRCodeSVG value={qrData} size={160} level="M" includeMargin={true} />
                    </div>
                  </div>
                </div>
              </div>

              {isPaid && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium"
                  >
                    <Download className="size-5" />
                    {downloading ? 'Preparing...' : 'Download Ticket'}
                  </button>
                </div>
              )}
            </div>

            {/* Seat Selection */}
            {isPaid && tripDetails && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-black mb-4">Select Your Seat</h3>
                <div className="mb-4 flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Object.keys(seatsByRow)
                    .sort((a, b) => Number(a) - Number(b))
                    .map((rowNum) => (
                      <div key={rowNum} className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500 w-6">{rowNum}</span>
                        <div className="flex gap-2 flex-1">
                          {seatsByRow[rowNum].map((seat: any, idx: number) => (
                            <button
                              key={seat.tripSeatGuid}
                              onClick={() =>
                                seat.status === 'Available' && setSelectedSeat(seat.tripSeatGuid)
                              }
                              disabled={seat.status !== 'Available'}
                              className={`flex-1 p-2 rounded-lg text-xs font-semibold transition-colors ${
                                seat.status !== 'Available'
                                  ? 'bg-red-200 text-red-700 cursor-not-allowed'
                                  : selectedSeat === seat.tripSeatGuid
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300 text-black'
                              } ${idx === 1 ? 'mr-2' : ''}`}
                            >
                              {seat.seatNumber}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>

                <button
                  onClick={handleSeatConfirm}
                  disabled={!selectedSeat || seatConfirming}
                  className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {seatConfirming ? 'Confirming...' : 'Confirm Seat'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
