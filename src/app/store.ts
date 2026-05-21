import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import walletReducer from "@/features/wallet/walletSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        wallet: walletReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

    devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
