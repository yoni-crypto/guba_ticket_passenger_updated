import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './features/searchSlice'
import cityReducer from './features/citySlice'
import tripReducer from './features/tripSlice'
import busCarrierReducer from './features/busCarrierSlice'
import bookingReducer from './features/bookingSlice'
import authReducer from './features/authSlice'
import ticketReducer from './features/ticketSlice'
import paymentReducer from './features/paymentSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      search: searchReducer,
      city: cityReducer,
      trip: tripReducer,
      busCarrier: busCarrierReducer,
      booking: bookingReducer,
      auth: authReducer,
      ticket: ticketReducer,
      payment: paymentReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
