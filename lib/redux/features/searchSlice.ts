import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  origin: string
  destination: string
  departureDate: string
}

const initialState: SearchState = {
  origin: '',
  destination: '',
  departureDate: '',
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<string>) => {
      state.origin = action.payload
    },
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload
    },
    setDepartureDate: (state, action: PayloadAction<string>) => {
      state.departureDate = action.payload
    },
    resetSearch: (state) => {
      state.origin = ''
      state.destination = ''
      state.departureDate = ''
    },
  },
})

export const { setOrigin, setDestination, setDepartureDate, resetSearch } = searchSlice.actions
export default searchSlice.reducer
