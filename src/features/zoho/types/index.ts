export interface ZohoConfig {
    client_id: string;
    client_secret: string;
    org_id: string;
    base_url: string;
    accounts_base_url: string;
    default_country: string;
    scopes: string;
}

export interface ZohoRedirectResponse {
    status: boolean;
    message: string;
    data: {
        redirect_url: string;
        redirect_uri: string;
        state: string;
    };
}

export interface ZohoConfigResponse {
    status: boolean;
    message: string;
    data: ZohoConfig;
}
