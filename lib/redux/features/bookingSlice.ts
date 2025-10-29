import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface BookingTicket {
  firstName: string
  lastName: string
  countryCode: string
  mobileNumber: string
  email: string
}

interface BookingRequest {
  tripGuid: string
  tickets: BookingTicket[]
}

interface BookingData {
  bookingGuid: string
  pnr: string
  payment: {
    paymentGuid: string
  }
  tickets: {
    ticketGuid: string
    fullName: string
    phoneNumber: string
    email: string
    ticketNumber: string
  }[]
}

interface BookingState {
  booking: BookingData | null
  loading: boolean
  error: string | null
}

const initialState: BookingState = {
  booking: null,
  loading: false,
  error: null,
}

export const bookTicket = createAsyncThunk(
  'booking/bookTicket',
  async (bookingData: BookingRequest, { getState }) => {
    const state = getState() as { auth: { token: string } }
    const token = state.auth.token
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/trip/ticket/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data.booking
  }
)

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.booking = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookTicket.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(bookTicket.fulfilled, (state, action) => {
        state.loading = false
        state.booking = action.payload
      })
      .addCase(bookTicket.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to book ticket'
      })
  },
})

export const { clearBooking } = bookingSlice.actions
export default bookingSlice.reducer