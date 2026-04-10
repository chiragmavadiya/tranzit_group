import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/store.types";
import type { User } from "@/features/auth/auth.types";

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem("auth_token", token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("auth_token");
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
