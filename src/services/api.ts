import { showToast, suspendToast } from "@/components/ui/custom-toast";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/react";

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
        const tokenData = localStorage.getItem("auth_token") || localStorage.getItem("user_auth_token");
        if (tokenData && config.headers) {
            config.headers.Authorization = `Bearer ${tokenData}`;
        }
        const role = (localStorage.getItem("user_role") && localStorage.getItem("user_role") !== 'undefined') ? localStorage.getItem("user_role") : "customer";
        // Only prefix if the URL doesn't already have one
        if (config.url && !config.url.startsWith('/admin') && !config.url.startsWith('/customer') && config.url !== '/localities/search') {
            // const cutsomRole = (role === 'Staff' || role === 'Operation Manager') ? 'admin' : role;
            config.url = `/${role?.toLowerCase()}${config.url}`;
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
        // Sentry.captureException(error);
        // Sentry Log
        const data = error.response?.data as any;
        console.log(data, 'data.....')
        const message = data?.message || error.message || "An error occurred";
        if (axios.isAxiosError(error)) {
            console.log("Set axios error", {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                statusText: error.response?.statusText,
                response: error.response?.data,
                request: error.config?.data,
                params: error.config?.params,
            })
            Sentry.withScope((scope) => {
                scope.setTransactionName(
                    `${error.config?.method?.toUpperCase()} ${error?.config?.url}`
                );
                // scope.setExtra("requestId", requestId);
                scope.setContext("API", {
                    url: error.config?.url,
                    method: error.config?.method,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    response: error.response?.data,
                    request: error.config?.data,
                    params: error.config?.params,
                });
                Sentry.captureException(error);
            });
        } else {
            console.log("Set normal error")
            Sentry.captureException(error);
        }

        if (data?.next_step === 'verify_email') {
            // navigate("/verify-email" + '/' + data.user.id + '/' + data.token);
            return Promise.reject(data);
        }

        // Update error message to use the server-side message if it exists
        error.message = message;

        // Handle global errors (e.g. 401 Unauthorized)
        if (error.response?.status === 401 && error.message !== 'Invalid credentials') {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
        }

        console.error("[API Error]:", {
            status: error.response?.status,
            message,
            url: error.config?.url,
        });

        // Handle validation errors - show specific validation messages
        if (error.message === 'Validation failed' || error.message === 'Order is missing required details.') {
            if (data?.errors) {
                const beErrors = data.errors;
                const formattedErrors: Record<string, string> = {};
                Object.keys(beErrors).forEach(key => {
                    showToast(beErrors[key][0], "error");
                    formattedErrors[key] = beErrors[key][0];
                    suspendToast();
                });
            }
            return Promise.reject(error);
        }

        // Handle server errors (5xx) - show generic message with requestId for support
        const requestId = error.response?.headers['x-request-id'] || error.response?.headers['X-Request-Id'] || data?.trace_id;
        if (error.response?.status && error.response.status >= 500) {
            if (requestId) {
                showToast(`Something went wrong. Please contact support with Request ID: ${requestId}`, 'error', '', Infinity)
            } else {
                showToast("Something went wrong. Please try again later.", 'error', '', Infinity)
            }
            suspendToast()
            return Promise.reject(error);
        }

        // Show actual error message for other errors (4xx)
        if (message && message !== 'canceled' && (data?.validation_error === undefined)) {
            showToast(message, 'error');
            suspendToast();
        }

        return Promise.reject(error);
    }
);
