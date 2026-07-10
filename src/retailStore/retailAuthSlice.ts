import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RetailUser = {
  id: string;
  email: string;
  name?: string;
  balance: number;
};

type AuthRetailState = {
  user: RetailUser | null;
  loading: boolean;
};

const initialState: AuthRetailState = {
  user: null,
  loading: true,
};

const retailAuthSlice = createSlice({
  name: "retailAuth",
  initialState,
  reducers: {
    setRetailUser(state, action: PayloadAction<RetailUser | null>) {
      state.user = action.payload;
      state.loading = false;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    logout(state) {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setRetailUser, setLoading, logout } = retailAuthSlice.actions;
export default retailAuthSlice.reducer;
