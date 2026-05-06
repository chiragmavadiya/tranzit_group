export interface Setting {
    id: number;
    name: string;
    slug: string;
    value?: string;
    payload?: Record<string, any>;
}

export interface SettingsResponse {
    status: boolean;
    message: string;
    data: Setting[];
}

export interface SingleSettingResponse {
    status: boolean;
    message: string;
    data: Setting;
}
