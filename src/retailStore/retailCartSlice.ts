import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RetailCartItem {
  id: string; // unique identifier
  hu: string;
  ntgName: string;

  region: string;
  regionName?: string;

  version: string;
  versionName?: string;

  vin: string;

  tokenCost: number;
  price: number;
}

interface RetailCartState {
  items: RetailCartItem[];
}

const initialState: RetailCartState = {
  items: [],
};

const retailCartSlice = createSlice({
  name: "retailCart",
  initialState,

  reducers: {
    hydrateCart: (state, action: PayloadAction<RetailCartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<RetailCartItem>) => {
      console.log("REDUX ADD:", action.payload);
      const exists = state.items.find((item) => item.id === action.payload.id);

      if (!exists) {
        state.items.push(action.payload);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, hydrateCart } =
  retailCartSlice.actions;

export default retailCartSlice.reducer;
