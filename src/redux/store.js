import { configureStore } from "@reduxjs/toolkit";
import {thunk} from 'redux-thunk';
import { CartSlice } from "./Slices/CartSlice";

export const store = configureStore({
  reducer: {
    cart: CartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});

export default store;
