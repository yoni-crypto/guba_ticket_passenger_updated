import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface BusCarrierSetting {
  maxPaymentMinutes: number
  maxTicketsPerUser: number
}

interface BusCarrier {
  busCarrierGuid: string
  displayName: string
  logoUrl: string
  setting?: BusCarrierSetting
}

interface Pagination {
  currentPage: number
  itemPageSize: number
  totalRecords: number
  totalPages: number
}

interface BusCarrierState {
  busCarriers: BusCarrier[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
}

const initialState: BusCarrierState = {
  busCarriers: [],
  pagination: null,
  loading: false,
  error: null,
}

export const fetchBusCarriers = createAsyncThunk(
  'busCarrier/fetchBusCarriers',
  async ({ pageNumber = 1, pageSize = 100, searchKeyword = '' }: { 
    pageNumber?: number
    pageSize?: number
    searchKeyword?: string
  } = {}) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/bus-carrier/list?PageNumber=${pageNumber}&PageSize=${pageSize}&searchKeyword=${searchKeyword}`
    )
    const data = await response.json()
    return data.data
  }
)

export const busCarrierSlice = createSlice({
  name: 'busCarrier',
  initialState,
  reducers: {
    clearBusCarriers: (state) => {
      state.busCarriers = []
      state.pagination = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusCarriers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBusCarriers.fulfilled, (state, action) => {
        state.loading = false
        state.busCarriers = action.payload.busCarriers
        state.pagination = action.payload.pagination
      })
      .addCase(fetchBusCarriers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch bus carriers'
      })
  },
})

export const { clearBusCarriers } = busCarrierSlice.actions
export default busCarrierSlice.reducer