import { store } from "@/app/store";
import type { User } from "@/features/auth/auth.types";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    role: 'admin' | 'client';
}
