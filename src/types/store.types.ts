import type { User, TeamAccess, BlackoutDay } from "@/features/auth/auth.types";

export interface AuthState {
    user: User | null;
    userID: number | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    role: string;
    next_step: string | null;
    default_courier: any | null;
    default_item: any | null;
    permissions: string[];
    team_access?: TeamAccess | null;
    is_sub_user: boolean;
    courier_settings?: any | null;
    blackout_days: BlackoutDay[];
}
