import { configureStore } from "@reduxjs/toolkit";
import retailAuthReducer from "./retailAuthSlice";
import { retailBaseApi } from "@/lib/retailApi/retailBaseApi";

export const retailStore = configureStore({
  reducer: {
    retailAuth: retailAuthReducer, // 👈 your login state
    [retailBaseApi.reducerPath]: retailBaseApi.reducer, // 👈 RTK Query
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(retailBaseApi.middleware),
});

export type RootRetailState = ReturnType<typeof retailStore.getState>;
export type AppRetailDispatch = typeof retailStore.dispatch;
