import { configureStore } from "@reduxjs/toolkit";
import retailAuthReducer from "./retailAuthSlice";
import retailCartReducer from "./retailCartSlice";
import { retailBaseApi } from "@/lib/retailApi/retailBaseApi";

export const retailStore = configureStore({
  reducer: {
    retailAuth: retailAuthReducer, // 👈 your login state
    retailCart: retailCartReducer,
    [retailBaseApi.reducerPath]: retailBaseApi.reducer, // 👈 RTK Query
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(retailBaseApi.middleware),
});

export type RootRetailState = ReturnType<typeof retailStore.getState>;
export type AppRetailDispatch = typeof retailStore.dispatch;
