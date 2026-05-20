import type { User } from "@/features/auth/auth.types";

export interface AuthState {
    user: User | null;
    userID: number | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    role: string;
    next_step: string | null;
}
