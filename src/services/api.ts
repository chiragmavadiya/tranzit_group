import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const tokenData = localStorage.getItem("auth_token");
        if (tokenData && config.headers) {
            let token = tokenData;
            try {
                const parsed = JSON.parse(tokenData);
                token = parsed.accessToken || tokenData;
            } catch (e) {
                // Not JSON, use as is
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const message = (error.response?.data as any)?.message || error.message || "An error occurred";

        // Update error message to use the server-side message if it exists
        error.message = message;

        // Handle global errors (e.g. 401 Unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            // Optional: window.location.href = "/login";
        }

        console.error("[API Error]:", {
            status: error.response?.status,
            message,
            url: error.config?.url,
        });

        return Promise.reject(error);
    }
);

export default api;