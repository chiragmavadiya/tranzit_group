export const BOOK_PICKUP_TABS = [
    { id: 'new', label: 'New', count: 6 },
    { id: 'booked', label: 'Booked', count: 25 },
] as const;

export type BookPickupTabType = typeof BOOK_PICKUP_TABS[number]['id'];
