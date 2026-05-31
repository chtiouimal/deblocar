import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/api/baseApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // 👈 your login state
    [baseApi.reducerPath]: baseApi.reducer, // 👈 RTK Query
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;