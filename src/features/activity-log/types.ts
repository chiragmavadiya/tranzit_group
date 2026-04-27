export interface ActivityLog {
    date: string;
    admin: string;
    email: string;
    action: string; // created, updated, deleted, status_changed, verified, settings_updated
    description: string;
    model_type: string;
    model_id: number;
    route: string | null;
    ip_address: string;
    changes?: {
        old_status?: string;
        new_status?: string;
        [key: string]: any;
    };
}

export interface ActivityLogFilters {
    role?: string;
    action?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
    page: number;
    per_page: number;
}

