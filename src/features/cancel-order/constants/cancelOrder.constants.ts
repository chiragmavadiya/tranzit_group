export const CANCEL_ORDER_TABS = [
    { id: 'request', label: 'Cancel Request', count: 0 },
    { id: 'canceled', label: 'Canceled Order', count: 0 },
] as const;

export type CancelOrderTabType = typeof CANCEL_ORDER_TABS[number]['id'];
