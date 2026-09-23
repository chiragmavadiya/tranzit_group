import { useCallback, useState } from 'react';
import { ConformationModal } from '@/components/common/ConformationModal';
import { useRestoreOrder } from './useOrders';

/**
 * Owns the whole "restore archived order" interaction — confirmation modal, mutation
 * and pending state — so the orders list and the order detail header share one copy.
 *
 * Render `restoreModal` once in the consumer and call `requestRestore(orderNumber)`
 * from whatever button triggers it.
 */
export const useRestoreOrderConfirm = () => {
    const [orderToRestore, setOrderToRestore] = useState<string | null>(null);
    const restoreOrderMutation = useRestoreOrder();

    const requestRestore = useCallback((orderNumber: string) => {
        setOrderToRestore(orderNumber);
    }, []);

    const handleConfirm = () => {
        if (!orderToRestore) return;
        restoreOrderMutation.mutate(orderToRestore, {
            onSettled: () => setOrderToRestore(null)
        });
    };

    const restoreModal = orderToRestore ? (
        <ConformationModal
            open={!!orderToRestore}
            onOpenChange={(open) => !open && setOrderToRestore(null)}
            title="Restore Order"
            description={`Are you sure you want to restore order ${orderToRestore}? It will be moved back into the pending orders list.`}
            onConfirm={handleConfirm}
            confirmText="Yes, Restore"
            cancelText="No, Keep Archived"
            loading={restoreOrderMutation.isPending}
        />
    ) : null;

    return {
        requestRestore,
        restoreModal,
        isRestoring: restoreOrderMutation.isPending,
        restoringOrderId: restoreOrderMutation.isPending ? String(restoreOrderMutation.variables) : null,
    };
};
