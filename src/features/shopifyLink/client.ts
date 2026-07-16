/**
* Adapt getAuthToken / setAuthToken to match your app (context, Redux, etc.).
*/

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.tranzit.digisite.net';

export function getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

export class ApiError extends Error {
    public status: number;
    public body?: unknown;

    constructor(
        message: string,
        status: number,
        body?: unknown,
    ) {
        super(message);
        this.status = status;
        this.body = body;
        this.name = 'ApiError';
    }
}

type RequestOptions = {
    method?: string;
    body?: unknown;
    auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = false } = options;

    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    if (auth) {
        const token = getAuthToken();
        if (!token) {
            throw new ApiError('Not authenticated', 401);
        }
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/api${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message =
            (data as { error?: string; message?: string }).error ??
            (data as { message?: string }).message ??
            'Request failed';
        throw new ApiError(message, response.status, data);
    }

    return data as T;
}

