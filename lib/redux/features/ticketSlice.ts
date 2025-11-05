import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Currency {
  name: string
  code: string
  symbol: string
}

interface BusCarrier {
  displayName: string
}

interface Station {
  name: string
  address: string
  region: { name: string }
  city: { name: string }
}

interface TripRoute {
  origin: Station
  estimatedTravelTime: string
  destination: Station
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

interface Trip {
  tripGuid: string
  code: string
  currency: Currency
  travelPrice: number
  departureDate: string
  departureTime: string
  busCarrier: BusCarrier
  tripRoute: TripRoute
  bus: Bus
}

interface Payment {
  paymentGuid: string
  billingId: string
  status: string
}

interface Drop {
  station: {
    name: string
  }
}

interface Booking {
  bookingGuid?: string
  pnr: string
  payment: Payment
  trip: Trip
  status?: string
  bookingDate?: string
  tickets?: {
    ticketGuid: string
    name: string
    phoneNumber: string
    email: string
    ticketNumber: string
  }[]
}

interface Ticket {
  ticketGuid: string
  fullName: string
  phoneNumber: string
  email: string
  ticketNumber: string
  status: string
  booking: Booking
  lastModified: string
}

interface Pagination {
  currentPage: number
  itemPageSize: number
  totalRecords: number
  totalPages: number
}

interface BookingDetail {
  bookingGuid: string
  pnr: string
  status: string
  lastModified: string
  payment: Payment
  trip: Trip
  tickets: {
    ticketGuid: string
    fullName: string
    phoneNumber: string
    email: string
    ticketNumber: string
  }[]
}

interface TicketDetail {
  ticketGuid: string
  fullName: string
  phoneNumber: string
  email: string
  ticketNumber: string
  booking: Booking
  status: string
  lastModified: string
}

interface TicketState {
  tickets: Ticket[]
  bookings: Booking[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
  searchResults: Booking[]
  searchPagination: Pagination | null
  searchLoading: boolean
  searchError: string | null
  ticketDetail: TicketDetail | null
  bookingDetail: BookingDetail | null
  detailLoading: boolean
  detailError: string | null
  seatConfirming: boolean
  seatConfirmError: string | null
}

const initialState: TicketState = {
  tickets: [],
  bookings: [],
  pagination: null,
  loading: false,
  error: null,
  searchResults: [],
  searchPagination: null,
  searchLoading: false,
  searchError: null,
  ticketDetail: null,
  bookingDetail: null,
  detailLoading: false,
  detailError: null,
  seatConfirming: false,
  seatConfirmError: null,
}

// Old endpoint - commented out
// export const fetchTickets = createAsyncThunk(
//   'ticket/fetchTickets',
//   async ({ pageNumber = 1, pageSize = 8, status = '' }: { 
//     pageNumber?: number
//     pageSize?: number
//     status?: string
//   }, { getState }) => {
//     const state = getState() as { auth: { token: string } }
//     const token = state.auth.token
//     
//     let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/trip/ticket/list?PageNumber=${pageNumber}&PageSize=${pageSize}`
//     if (status) {
//       url += `&status=${status}`
//     }
//     
//     const response = await fetch(url, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//     const data = await response.json()
//     if (!response.ok) throw new Error(data.message)
//     return data.data
//   }
// )

// New booking list endpoint
export const fetchBookings = createAsyncThunk(
  'ticket/fetchBookings',
  async ({ pageNumber = 1, pageSize = 10, status = '', searchKeyword = '' }: { 
    pageNumber?: number
    pageSize?: number
    status?: string
    searchKeyword?: string
  }, { getState }) => {
    const state = getState() as { auth: { token: string } }
    const token = state.auth.token
    
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/trip/booking/list?PageNumber=${pageNumber}&PageSize=${pageSize}`
    if (status) {
      url += `&status=${status}`
    }
    if (searchKeyword) {
      url += `&searchKeyword=${searchKeyword}`
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data
  }
)

export const fetchTickets = fetchBookings

export const searchTicketByPNR = createAsyncThunk(
  'ticket/searchByPNR',
  async ({ searchQuery, pageNumber = 1, pageSize = 8 }: { 
    searchQuery: string
    pageNumber?: number
    pageSize?: number
  }) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/trip/ticket/search?PageNumber=${pageNumber}&PageSize=${pageSize}&searchQuery=${searchQuery}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data
  }
)

// Old endpoint - commented out
// export const fetchTicketDetail = createAsyncThunk(
//   'ticket/fetchDetail',
//   async (ticketGuid: string, { getState }) => {
//     const state = getState() as { auth: { token: string } }
//     const token = state.auth.token
//     
//     const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/trip/ticket/details?id=${ticketGuid}`
//     
//     const response = await fetch(url, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//     const data = await response.json()
//     if (!response.ok) throw new Error(data.message)
//     return data.data.ticket
//   }
// )

// New booking detail endpoint
export const fetchBookingDetail = createAsyncThunk(
  'ticket/fetchBookingDetail',
  async (bookingGuid: string, { getState }) => {
    const state = getState() as { auth: { token: string } }
    const token = state.auth.token
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/trip/booking/ticket/list?id=${bookingGuid}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch booking details')
    return data.data.booking
  }
)

export const fetchTicketDetail = fetchBookingDetail

export const confirmSeat = createAsyncThunk(
  'ticket/confirmSeat',
  async ({ ticketGuid, tripSeatGuid }: { ticketGuid: string; tripSeatGuid: string }, { getState }) => {
    const state = getState() as { auth: { token: string } }
    const token = state.auth.token
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/trip/ticket/seat/confirm`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticketGuid, tripSeatGuid }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data
  }
)

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    clearTickets: (state) => {
      state.tickets = []
      state.pagination = null
      state.error = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchPagination = null
      state.searchError = null
    },
    clearTicketDetail: (state) => {
      state.ticketDetail = null
      state.detailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload.bookings
        state.pagination = action.payload.pagination
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch bookings'
      })
      .addCase(searchTicketByPNR.pending, (state) => {
        state.searchLoading = true
        state.searchError = null
      })
      .addCase(searchTicketByPNR.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload.bookings
        state.searchPagination = action.payload.pagination
      })
      .addCase(searchTicketByPNR.rejected, (state, action) => {
        state.searchLoading = false
        state.searchError = action.error.message || 'Failed to search ticket'
      })
      .addCase(fetchBookingDetail.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchBookingDetail.fulfilled, (state, action) => {
        state.detailLoading = false
        state.bookingDetail = action.payload
      })
      .addCase(fetchBookingDetail.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.error.message || 'Failed to fetch booking details'
      })
      .addCase(confirmSeat.pending, (state) => {
        state.seatConfirming = true
        state.seatConfirmError = null
      })
      .addCase(confirmSeat.fulfilled, (state) => {
        state.seatConfirming = false
      })
      .addCase(confirmSeat.rejected, (state, action) => {
        state.seatConfirming = false
        state.seatConfirmError = action.error.message || 'Failed to confirm seat'
      })
  },
})

export const { clearTickets, clearSearchResults, clearTicketDetail } = ticketSlice.actions
export default ticketSlice.reducer