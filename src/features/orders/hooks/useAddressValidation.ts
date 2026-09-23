import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/api.constants';
import { addressValidationService } from '@/features/orders/services/address-validation.api';

export const useApplyAddressValidation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updates: Array<{ order_number: string; suburb: string; state: string; postcode: string }>) =>
            addressValidationService.apply(updates),
        retry: 0,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.LIST });
        },
    });
};
