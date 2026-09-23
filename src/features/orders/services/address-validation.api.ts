import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

interface AddressValidationApplyResponse {
    status: boolean;
    message: string;
    data: {
        updated: number;
        failed: number;
        results: Array<{
            order_number: string;
            updated: boolean;
            message: string;
        }>;
    };
}

export const addressValidationService = {
    apply: async (updates: Array<{ order_number: string; suburb: string; state: string; postcode: string }>) => {
        const response = await api.post<AddressValidationApplyResponse>(
            API_ENDPOINTS.ORDERS.VALIDATE_ADDRESSES_APPLY,
            { updates }
        );
        return response.data;
    },
};
