import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Currency {
  name: string
  code: string
  symbol: string
}

interface Finance {
  allowRefunds: boolean
  allowTicketCancellation: boolean
  allowCancellationAfterPayment: boolean
  refundWindowHours: number
  freeCancellationMinutes: number
  cancellationFeePercent: number
  lastCancellationHours: number
  maxPaymentMinutes: number
  lastMinuteBookingMinutes: number
  noShowMinutesBeforeDeparture: number
  noShowPenalty: string
}

interface TripAndTicket {
  maxTicketsPerUser: number
  enableAutoSeatAssignment: boolean
  advanceBookingDays: number
  daysToGenerateTrips: number
}

interface Notification {
  enableSMSNotifications: boolean
  enableEmailNotifications: boolean
}

interface BusCarrierSetting {
  currency: Currency
  finance: Finance
  tripAndTicket: TripAndTicket
  notification: Notification
}

interface BusCarrier {
  displayName: string
  setting: BusCarrierSetting
}

interface Station {
  name: string
  address?: string
  region?: { name: string }
  city?: { name: string }
}

interface Drop {
  station: Station
}

interface TripRoute {
  origin: Station
  estimatedTravelTime: string
  destination: Station
  pickUp: Record<string, unknown>
  drops: Drop[]
}

interface Amenities {
  hasWifi: boolean
  hasAC: boolean
  hasRestroom: boolean
  hasRefreshment: boolean
}

interface Bus {
  plateNumber: string
  amenities: Amenities
}

interface Seat {
  tripSeatGuid: string
  rowNumber: number
  columnNumber: number
  seatNumber: number
  seatType?: string
  status: string
}

interface SeatAvailability {
  seats: Seat[]
  bookedSeats: number | string
  availableSeats: number | string
}

interface Trip {
  tripGuid: string
  currency: Currency
  travelPrice: number
  departureDate: string
  busCarrier: BusCarrier
  tripRoute: TripRoute
  bus: Bus
  seatAvailability: SeatAvailability
}

interface Pagination {
  currentPage: number
  itemPageSize: number
  totalRecords: number
  totalPages: number
}

interface TripState {
  trips: Trip[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
  tripDetails: Trip | null
  detailsLoading: boolean
  detailsError: string | null
}

const initialState: TripState = {
  trips: [],
  pagination: null,
  loading: false,
  error: null,
  tripDetails: null,
  detailsLoading: false,
  detailsError: null,
}

export const searchTrips = createAsyncThunk(
  'trip/searchTrips',
  async ({ originGuid, destinationGuid, travelDate, pageNumber = 1, pageSize = 10, busCarrierGuid }: { 
    originGuid: string
    destinationGuid: string
    travelDate: string
    pageNumber?: number
    pageSize?: number
    busCarrierGuid?: string
  }) => {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/trip/search?originGuid=${originGuid}&destinationGuid=${destinationGuid}&travelDate=${travelDate}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    if (busCarrierGuid) {
      url += `&busCarrierGuid=${busCarrierGuid}`
    }
    const response = await fetch(url)
    const data = await response.json()
    
    if (response.status === 404) {
      return { trips: [], pagination: null }
    }
    
    return data.data
  }
)

export const getTripDetails = createAsyncThunk(
  'trip/getTripDetails',
  async (tripId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/trip/details?id=${tripId}`)
    const data = await response.json()
    return data.data.trip
  }
)



export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    clearTrips: (state) => {
      state.trips = []
      state.pagination = null
      state.error = null
    },
    clearTripDetails: (state) => {
      state.tripDetails = null
      state.detailsError = null
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTrips.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.loading = false
        state.trips = action.payload.trips
        state.pagination = action.payload.pagination
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to search trips'
      })
      .addCase(getTripDetails.pending, (state) => {
        state.detailsLoading = true
        state.detailsError = null
      })
      .addCase(getTripDetails.fulfilled, (state, action) => {
        state.detailsLoading = false
        state.tripDetails = action.payload
      })
      .addCase(getTripDetails.rejected, (state, action) => {
        state.detailsLoading = false
        state.detailsError = action.error.message || 'Failed to get trip details'
      })
  },
})

export const { clearTrips, clearTripDetails } = tripSlice.actions
export default tripSlice.reducer
