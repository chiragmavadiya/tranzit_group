import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/store.types";
import type { User } from "@/features/auth/auth.types";

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),
    isLoading: false,
    error: null,
    role: localStorage.getItem("user_role") as 'admin' | 'client' || 'client',
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string, role: 'admin' | 'client' }>
        ) => {
            const { user, token, role } = action.payload;
            state.user = user;
            state.role = role;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem("auth_token", JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("auth_token");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
