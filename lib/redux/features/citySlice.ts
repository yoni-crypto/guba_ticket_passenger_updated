import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Region {
  regionGuid: string
  name: string
}

interface City {
  cityGuid: string
  region: Region
  name: string
  lastModified: string
  status: string
}

interface Pagination {
  currentPage: number
  itemPageSize: number
  totalRecords: number
  totalPages: number
}

interface CityState {
  cities: City[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
}

const initialState: CityState = {
  cities: [],
  pagination: null,
  loading: false,
  error: null,
}

export const fetchCities = createAsyncThunk(
  'city/fetchCities',
  async ({ pageNumber = 1, pageSize = 200, searchKeyword = '' }: { pageNumber?: number; pageSize?: number; searchKeyword?: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/city/list?PageNumber=${pageNumber}&PageSize=${pageSize}&searchKeyword=${searchKeyword}`
    )
    const data = await response.json()
    return data.data
  }
)

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    clearCities: (state) => {
      state.cities = []
      state.pagination = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false
        state.cities = action.payload.cities
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch cities'
      })
  },
})

export const { clearCities } = citySlice.actions
export default citySlice.reducer
