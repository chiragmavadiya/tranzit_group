import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WalletSummaryResponse } from "./types";

interface WalletState {
  summary: WalletSummaryResponse["data"] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  summary: null,
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletSummary: (state, action: PayloadAction<WalletSummaryResponse["data"]>) => {
      state.summary = action.payload;
    },
    clearWalletSummary: (state) => {
      state.summary = null;
    },
  },
});

export const { setWalletSummary, clearWalletSummary } = walletSlice.actions;
export default walletSlice.reducer;
