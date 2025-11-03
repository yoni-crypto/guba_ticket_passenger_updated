'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchBookingDetail, clearTicketDetail, confirmSeat } from '@/lib/redux/features/ticketSlice'
import { getTripDetails } from '@/lib/redux/features/tripSlice'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { QRCodeSVG } from 'qrcode.react'
import { Download, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image-more'
import JsBarcode from 'jsbarcode'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { bookingDetail, detailLoading, detailError, seatConfirming } = useAppSelector((state) => state.ticket)
  const { tripDetails } = useAppSelector((state) => state.trip)
  const ticketRef = useRef<HTMLDivElement>(null)
  const bookingId = params.id as string
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<number>(-1)
  const [showDropdown, setShowDropdown] = useState(false)
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingDetail(bookingId))
    }
    return () => {
      dispatch(clearTicketDetail())
    }
  }, [dispatch, bookingId])

  useEffect(() => {
    if (bookingDetail) dispatch(getTripDetails(bookingDetail.trip.tripGuid))
  }, [dispatch, bookingDetail])

  useEffect(() => {
    if (barcodeRef.current && bookingDetail) {
      JsBarcode(barcodeRef.current, bookingDetail.payment.billingId, {
        format: 'CODE128',
        width: 1,
        height: 40,
        displayValue: false,
        margin: 0
      })
    }
  }, [bookingDetail])

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
        bgcolor: '#ffffff',
        width: ticketElement.clientWidth * scale,
        height: ticketElement.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${ticketElement.clientWidth}px`,
          height: `${ticketElement.clientHeight}px`,
          border: 'none',
          outline: 'none',
          boxShadow: 'none'
        },
        filter: (node: any) => {
          if (node.style) {
            node.style.border = 'none'
            node.style.outline = 'none'
            node.style.boxShadow = 'none'
          }
          return true
        }
      })

      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)
      const fileName = selectedTicket === -1 
        ? `tickets-${bookingDetail?.pnr || 'booking'}.pdf`
        : `ticket-${bookingDetail?.pnr}-${bookingDetail?.tickets[selectedTicket]?.fullName.replace(/\s+/g, '-') || 'passenger'}.pdf`
      pdf.save(fileName)

      toast.success('Ticket downloaded successfully!')
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

    const result = await dispatch(confirmSeat({ ticketGuid: bookingDetail?.tickets[0]?.ticketGuid || '', tripSeatGuid: selectedSeat }))
    if (confirmSeat.fulfilled.match(result)) {
      toast.success('Seat confirmed successfully')
      dispatch(fetchBookingDetail(bookingId))
      dispatch(getTripDetails(bookingDetail!.trip.tripGuid))
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

  if (detailError || !bookingDetail) {
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

  const { trip, payment, pnr, status, tickets } = bookingDetail
  const isPaid = payment.status.toLowerCase() === 'paid'
  const firstTicket = tickets[0]
  const currentTicket = selectedTicket === -1 ? firstTicket : tickets[selectedTicket]
  const qrData = selectedTicket === -1 
    ? `PNR:${pnr}|BOOKING:${bookingDetail.bookingGuid}|TRIP:${trip.code}|DATE:${trip.departureDate}`
    : `PNR:${pnr}|TICKET:${currentTicket?.ticketGuid}|PASSENGER:${currentTicket?.fullName}|TRIP:${trip.code}|DATE:${trip.departureDate}`

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
                className="bg-white border border-gray-300 relative"
              >
                <div className="flex">
                  {/* Left Side - Ticket Details */}
                  <div className="w-3/5 p-6">
                    <div className="mb-4">
                      <h1 className="text-xl font-bold text-black mb-1">{trip.busCarrier.displayName}</h1>
                      <p className="text-gray-600 text-sm">Bus Ticket</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">FROM</p>
                          <p className="text-lg font-bold text-black">{trip.tripRoute.origin.city.name}</p>
                          <p className="text-sm text-gray-600">{trip.tripRoute.origin.name}</p>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-xs text-gray-500">→</p>
                          <p className="text-xs text-gray-500">{trip.tripRoute.estimatedTravelTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">TO</p>
                          <p className="text-lg font-bold text-black">{trip.tripRoute.destination.city.name}</p>
                          <p className="text-sm text-gray-600">{trip.tripRoute.destination.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">PNR: <span className="font-mono font-bold text-black">{pnr}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500">Bus: <span className="font-bold text-black">{trip.bus.plateNumber}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date: <span className="font-bold text-black">{new Date(trip.departureDate).toLocaleDateString()}</span></p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time: <span className="font-bold text-black">{trip.departureTime}</span></p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">PASSENGERS</p>
                      {selectedTicket === -1 ? (
                        tickets.map((ticket, index) => (
                          <div key={ticket.ticketGuid} className="mb-1">
                            <p className="text-sm font-bold text-black">{ticket.fullName}</p>
                            <p className="text-xs text-gray-600">{ticket.phoneNumber}</p>
                          </div>
                        ))
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-black">{tickets[selectedTicket]?.fullName}</p>
                          <p className="text-xs text-gray-600">{tickets[selectedTicket]?.phoneNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Payment & Codes */}
                  <div className="w-2/5 border-l border-gray-300 p-4">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">PAYMENT STATUS</p>
                      <p className={`text-sm font-bold ${
                        isPaid ? 'text-green-600' : 'text-orange-600'
                      }`}>{payment.status}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">AMOUNT</p>
                      <p className="text-lg font-bold text-black">{trip.currency.symbol}{selectedTicket === -1 ? trip.travelPrice * tickets.length : trip.travelPrice}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 text-center">QR CODE</p>
                      <div className="flex justify-center">
                        <QRCodeSVG value={qrData} size={80} level="M" includeMargin={false} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-2 text-center">BILLING ID</p>
                      <div className="flex justify-center">
                        <svg ref={barcodeRef} className="max-w-full"></svg>
                      </div>
                      <p className="text-xs text-center mt-1 font-mono text-gray-600">{payment.billingId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {isPaid && (
                <div className="mt-6 space-y-4">
                  {tickets.length > 1 ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-black mb-3">Download Options</h3>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => {
                            setSelectedTicket(-1)
                            handleDownloadPDF()
                          }}
                          disabled={downloading}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium disabled:opacity-50"
                        >
                          <Download className="size-5" />
                          {downloading && selectedTicket === -1 ? 'Preparing...' : 'Download All Tickets'}
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 font-medium"
                          >
                            <Download className="size-5" />
                            Download Individual
                          </button>
                          {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                              {tickets.map((ticket, index) => (
                                <button
                                  key={ticket.ticketGuid}
                                  onClick={() => {
                                    setSelectedTicket(index)
                                    setShowDropdown(false)
                                    handleDownloadPDF()
                                  }}
                                  disabled={downloading}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl disabled:opacity-50"
                                >
                                  <div className="font-medium text-black">{ticket.fullName}</div>
                                  <div className="text-sm text-gray-600">{ticket.phoneNumber}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
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
              )}
            </div>

            {/* Seat Selection */}
            {isPaid && tripDetails && (
              <div className="bg-white border border-gray-200 p-4">
                <h3 className="text-lg font-bold mb-4">Select Seat</h3>
                
                <div className="mb-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-300 border border-gray-400"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-500 border border-red-600"></div>
                    <span>Taken</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-500 border border-blue-600"></div>
                    <span>Selected</span>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 mb-4">
                  <div className="text-center mb-3">
                    <div className="bg-gray-400 text-white px-3 py-1 text-xs">DRIVER</div>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.keys(seatsByRow)
                      .sort((a, b) => Number(a) - Number(b))
                      .map((rowNum) => (
                        <div key={rowNum} className="flex items-center gap-2">
                          <span className="text-xs w-4 text-center">{rowNum}</span>
                          <div className="flex gap-1 flex-1 justify-center">
                            {seatsByRow[rowNum].map((seat: any, idx: number) => (
                              <div key={seat.tripSeatGuid} className={idx === 1 ? 'mr-3' : ''}>
                                <button
                                  onClick={() => seat.status === 'Available' && setSelectedSeat(seat.tripSeatGuid)}
                                  disabled={seat.status !== 'Available'}
                                  className={`w-7 h-7 text-xs font-bold border-2 ${
                                    seat.status !== 'Available'
                                      ? 'bg-red-500 border-red-600 text-white cursor-not-allowed'
                                      : selectedSeat === seat.tripSeatGuid
                                      ? 'bg-blue-500 border-blue-600 text-white'
                                      : 'bg-gray-300 border-gray-400 text-black hover:bg-gray-400'
                                  }`}
                                >
                                  {seat.seatNumber}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={handleSeatConfirm}
                  disabled={!selectedSeat || seatConfirming}
                  className="w-full py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {seatConfirming ? 'Confirming...' : selectedSeat ? 'Confirm Seat' : 'Select a Seat'}
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