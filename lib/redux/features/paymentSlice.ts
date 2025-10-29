import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface PaymentOptionParameter {
  paymentOptionParameterGuid: string
  key: string
  value: string
}

interface PaymentOption {
  paymentOptionGuid: string
  name: string
  code: string
  description: string
  status: string
  lastModified: string
  parameters: PaymentOptionParameter[]
}

interface Pagination {
  currentPage: number
  itemPageSize: number
  totalRecords: number
  totalPages: number
}

interface PaymentState {
  paymentOptions: PaymentOption[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
  paymentLoading: boolean
  paymentError: string | null
  paymentResponse: any
}

const initialState: PaymentState = {
  paymentOptions: [],
  pagination: null,
  loading: false,
  error: null,
  paymentLoading: false,
  paymentError: null,
  paymentResponse: null,
}

export const fetchPaymentOptions = createAsyncThunk(
  'payment/fetchOptions',
  async ({ pageNumber = 1, pageSize = 10 }: { pageNumber?: number; pageSize?: number }, { getState }) => {
    const state = getState() as { auth: { token: string } }
    const token = state.auth.token
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment-option/list?PageNumber=${pageNumber}&PageSize=${pageSize}&status=Active`
    
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

export const processPayment = createAsyncThunk(
  'payment/process',
  async (
    {
      paymentGuid,
      paymentOptionGuid,
      paymentAmount,
      email,
      firstName,
      lastName,
    }: {
      paymentGuid: string
      paymentOptionGuid: string
      paymentAmount: number
      email: string
      firstName: string
      lastName: string
    },
    { getState }
  ) => {
    const state = getState() as { auth: { token: string } }
    const token = state.auth.token

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/passenger/ticket/payment/pay`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentGuid,
        paymentOptionGuid,
        paymentAmount,
        email,
        firstName,
        lastName,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)
    return data.data
  }
)

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentResponse: (state) => {
      state.paymentResponse = null
      state.paymentError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentOptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentOptions.fulfilled, (state, action) => {
        state.loading = false
        state.paymentOptions = action.payload.paymentOptions
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPaymentOptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch payment options'
      })
      .addCase(processPayment.pending, (state) => {
        state.paymentLoading = true
        state.paymentError = null
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.paymentLoading = false
        state.paymentResponse = action.payload
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.paymentLoading = false
        state.paymentError = action.error.message || 'Payment failed'
      })
  },
})

export const { clearPaymentResponse } = paymentSlice.actions
export default paymentSlice.reducer
