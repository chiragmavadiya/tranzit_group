export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
    id: string;
    name: string;
    email: string;
    mobile: string;
    business_name: string;
    customer_id: string;
    created_at: string;
    last_login_at: string | null;
    suburb: string;
    state: string;
    status: CustomerStatus;
    avatar_color?: string;
}

export interface CustomerStats {
    total: number;
    active: number;
    inactive: number;
}
