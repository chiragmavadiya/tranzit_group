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
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = (error.response?.data as any)?.message || error.message || "An error occurred";

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