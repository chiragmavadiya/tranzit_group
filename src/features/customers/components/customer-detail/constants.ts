import { Package, Wallet, MapPin, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export const MOCK_STATS = [
    { label: 'Total Order', value: '1', icon: Package, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: 'Total Wallet Balance', value: '$63.70', icon: Wallet, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: 'Total Pickup Charge', value: '$0.00', icon: MapPin, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: 'Total Credit', value: '$80.00', icon: TrendingUp, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
    { label: 'Total Debit', value: '$16.30', icon: TrendingDown, iconColor: 'text-red-500', iconBg: 'bg-red-50' },
    { label: 'Total Margin', value: '$0.00', icon: CreditCard, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
];

export const CUSTOMER_TABS = ['Profile', 'Orders', 'Integration', 'Transaction', 'Credit Application', 'Invoice Management'];
