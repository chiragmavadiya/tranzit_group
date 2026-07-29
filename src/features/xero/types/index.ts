export interface XeroStatus {
    connected: boolean;
    status?: string;
    tenant_id?: string;
    organisation_name?: string;
    tenant_type?: string;
    scopes?: string;
    token_expires_at?: string;
    token_expired?: boolean;
    last_refreshed_at?: string;
    last_error?: string | null;
    connected_by?: string;
    connected_at?: string;
    has_access_token?: boolean;
    has_refresh_token?: boolean;
}

export interface XeroStatusResponse {
    status: number;
    message: string;
    data: XeroStatus;
    trace_id?: string;
}

export interface XeroConnectResponse {
    status: number;
    message: string;
    data: {
        authorization_url: string;
        state: string;
        already_connected: boolean;
    };
    trace_id?: string;
}

export interface XeroContact {
    ContactID: string;
    ContactStatus?: string;
    FirstName?: string;
    LastName?: string;
    EmailAddress?: string;
    Name?: string;
}

export interface XeroContactsResponse {
    status: number;
    message: string;
    data: {
        contacts: XeroContact[];
        pagination: unknown | null;
    };
    trace_id?: string;
}

export interface XeroSyncInvoiceResponse {
    status: number;
    message: string;
    data?: unknown;
    trace_id?: string;
}

export interface XeroDisconnectResponse {
    status: number;
    message: string;
    data: {
        connected: boolean;
    };
    trace_id?: string;
}
