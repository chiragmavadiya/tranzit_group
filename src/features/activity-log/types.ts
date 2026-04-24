export interface ActivityLog {
    id: string;
    index: number;
    dateTime: string;
    adminName: string;
    adminRole: string;
    email: string;
    action: 'Created' | 'Updated' | 'Deleted' | 'Logged In' | 'Logged Out';
    model: string;
    description: string;
    details: {
        modelId?: string;
        route: string;
        ip: string;
    };
}

export interface ActivityLogFilters {
    role?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page: number;
    perPage: number;
}
