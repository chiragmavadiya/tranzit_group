import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/store.types";
import type { User } from "@/features/auth/auth.types";
import { ADMIN_ROLES } from "@/constants";

const initialState: AuthState = {
    user: null,
    userID: JSON.parse(localStorage.getItem("auth_userID") || "null"),
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),
    isLoading: false,
    error: null,
    role: localStorage.getItem("user_role") as string,
    next_step: '',
    default_courier: null,
    default_item: null,
    subRole: localStorage.getItem("user_sub_role") as string,
    permissions: JSON.parse(localStorage.getItem("user_permissions") || "[]"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ userID: number; token: string, role: string, next_step: string, user?: User, sub_role?: string }>
        ) => {
            const { userID, token, role, next_step, user, sub_role } = action.payload;
            state.userID = userID;
            state.role = role;
            state.token = token;
            state.next_step = next_step;
            if (user) state.user = user;
            state.isAuthenticated = true;
            localStorage.setItem("auth_userID", JSON.stringify(userID));
            localStorage.setItem("user_role", role);
            localStorage.setItem("user_sub_role", sub_role || '');
            localStorage.setItem("auth_token", token);
        },
        setUser: (state, action: PayloadAction<{ user: User; next_step?: string, default_courier?: any, default_item?: any }>) => {
            const { user, next_step, default_courier, default_item } = action.payload;
            state.user = user;
            state.userID = user.id;
            state.isAuthenticated = true;
            const role = ADMIN_ROLES.includes(user.role) ? 'admin' : user.roles?.[0]?.name;
            state.default_courier = default_courier;
            state.default_item = default_item;
            if (role) {
                state.role = role;
                state.subRole = user.role;
                localStorage.setItem("user_role", role);
                localStorage.setItem("user_sub_role", user.role || '');
            }
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
            state.permissions = [];
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_userID");
            localStorage.removeItem("user_role");
            localStorage.removeItem("user_sub_role");
            localStorage.removeItem("user_permissions");
            sessionStorage.removeItem("verify-email-payloads");
        },
        setPermissions: (state, action: PayloadAction<string[]>) => {
            state.permissions = action.payload;
            localStorage.setItem("user_permissions", JSON.stringify(action.payload));
        },
    },
});

export const { setCredentials, logout, setUser, setNextStep, setPermissions } = authSlice.actions;
export default authSlice.reducer;
