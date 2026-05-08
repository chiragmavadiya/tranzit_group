export interface Setting {
    id: number;
    name: string;
    slug: string;
    value?: string;
    payload?: Record<string, any>;
}

export interface SettingCategory {
    id: number;
    name: string;
    slug: string;
    settings: Setting[];
}

export interface SettingsResponse {
    status: boolean;
    message: string;
    data: SettingCategory[];
}

export interface SingleSettingResponse {
    status: boolean;
    message: string;
    data: Setting;
}
