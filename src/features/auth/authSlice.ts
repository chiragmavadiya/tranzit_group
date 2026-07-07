import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/store.types";
import type { User, TeamAccess, BlackoutDay } from "@/features/auth/auth.types";

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
    is_sub_user: false,
    default_item: null,
    permissions: JSON.parse(localStorage.getItem("user_permissions") || "[]"),
    team_access: JSON.parse(localStorage.getItem("team_access") || "null"),
    courier_settings: JSON.parse(localStorage.getItem("courier_settings") || "null"),
    blackout_days: JSON.parse(localStorage.getItem("blackout_days") || "[]"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ userID: number; token: string, role: string, next_step: string, user?: User, team_access?: TeamAccess, courier_settings?: any, blackout_days?: BlackoutDay[] }>
        ) => {
            const { userID, token, role, next_step, user, team_access, courier_settings, blackout_days } = action.payload;
            state.userID = userID;
            state.role = role;
            state.token = token;
            state.next_step = next_step;
            if (user) state.user = user;
            if (team_access) {
                state.team_access = team_access;
                state.is_sub_user = team_access.is_sub_user;
                localStorage.setItem("team_access", JSON.stringify(team_access));
            }
            if (courier_settings) {
                state.courier_settings = courier_settings;
                localStorage.setItem("courier_settings", JSON.stringify(courier_settings));
            }
            if (blackout_days) {
                state.blackout_days = blackout_days;
                localStorage.setItem("blackout_days", JSON.stringify(blackout_days));
            }
            state.isAuthenticated = true;
            localStorage.setItem("auth_userID", JSON.stringify(userID));
            localStorage.setItem("user_role", role);
            localStorage.setItem("auth_token", token);
        },
        setUser: (state, action: PayloadAction<{ user: User; next_step?: string, default_courier?: any, default_item?: any, team_access?: TeamAccess, courier_settings?: any, blackout_days?: BlackoutDay[] }>) => {
            const { user, next_step, default_courier, default_item, team_access, courier_settings, blackout_days } = action.payload;
            state.user = user;
            state.userID = user.id;
            state.isAuthenticated = true;
            const role = user.role;
            state.default_courier = default_courier;
            state.default_item = default_item;
            if (courier_settings !== undefined) {
                state.courier_settings = courier_settings;
                localStorage.setItem("courier_settings", JSON.stringify(courier_settings));
            }
            if (blackout_days !== undefined) {
                state.blackout_days = blackout_days;
                localStorage.setItem("blackout_days", JSON.stringify(blackout_days));
            }
            if (role) {
                state.role = role.toLowerCase();
                localStorage.setItem("user_role", role.toLowerCase());
            }
            if (next_step !== undefined) state.next_step = next_step;
            if (team_access !== undefined) {
                state.team_access = team_access;
                state.is_sub_user = team_access.is_sub_user;
                localStorage.setItem("team_access", JSON.stringify(team_access));
            }
        },
        setCourierSettings: (state, action: PayloadAction<{ courier_settings?: any }>) => {
            const { courier_settings } = action.payload;
            if (courier_settings !== undefined) {
                state.courier_settings = courier_settings;
                localStorage.setItem("courier_settings", JSON.stringify(courier_settings));
            }
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
            state.team_access = null;
            state.courier_settings = null;
            state.blackout_days = [];
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_userID");
            localStorage.removeItem("user_role");
            localStorage.removeItem("user_sub_role");
            localStorage.removeItem("user_permissions");
            localStorage.removeItem("team_access");
            localStorage.removeItem("courier_settings");
            localStorage.removeItem("blackout_days");
            sessionStorage.removeItem("verify-email-payloads");
        },
        setPermissions: (state, action: PayloadAction<string[]>) => {
            state.permissions = action.payload;
            localStorage.setItem("user_permissions", JSON.stringify(action.payload));
        },
    },
});

export const { setCredentials, logout, setUser, setNextStep, setPermissions, setCourierSettings } = authSlice.actions;
export default authSlice.reducer;
