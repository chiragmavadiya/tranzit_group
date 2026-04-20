import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/store.types";
import type { User } from "@/features/auth/auth.types";

const initialState: AuthState = {
    user: null,
    userID: JSON.parse(localStorage.getItem("auth_userID") || "null"),
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),
    isLoading: false,
    error: null,
    role: localStorage.getItem("user_role") as string,
    next_step: '',
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ userID: number; token: string, role: string, next_step: string, user?: User }>
        ) => {
            const { userID, token, role, next_step, user } = action.payload;
            state.userID = userID;
            state.role = role;
            state.token = token;
            state.next_step = next_step;
            if (user) state.user = user;
            state.isAuthenticated = true;
            localStorage.setItem("auth_userID", JSON.stringify(userID));
            localStorage.setItem("user_role", role);
            localStorage.setItem("auth_token", token);
        },
        setUser: (state, action: PayloadAction<{ user: User; next_step?: string }>) => {
            const { user, next_step } = action.payload;
            state.user = user;
            state.userID = user.id;
            if (next_step !== undefined) state.next_step = next_step;
        },
        setNextStep: (state, action: PayloadAction<string>) => {
            state.next_step = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.userID = null;
            state.token = null;
            state.isAuthenticated = false;
            state.next_step = '';
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_userID");
            localStorage.removeItem("user_role");
        },
    },
});

export const { setCredentials, logout, setUser, setNextStep } = authSlice.actions;
export default authSlice.reducer;
