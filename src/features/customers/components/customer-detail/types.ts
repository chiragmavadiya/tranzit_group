export interface ActivityItem {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    status?: 'success' | 'pending' | 'failed';
    amount?: string;
    invoiceNo?: string;
}

export interface MarkupItem {
    courier: string;
    markup: string;
    pickup: string;
}

export interface CustomerDetail {
    id: string;
    name: string;
    location: string;
    joinedDate: string;
    balance: string;
    verified: boolean;
    fullName: string;
    status: string;
    role: string;
    gst: string;
    businessName: string;
    contact: string;
    email: string;
    address: string;
    postcode: string;
    markup: MarkupItem[];
}
