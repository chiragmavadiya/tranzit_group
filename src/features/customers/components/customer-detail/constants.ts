import { Package, Wallet, MapPin, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import type { ActivityItem, CustomerDetail } from './types';

export const MOCK_DETAIL_CUSTOMER: CustomerDetail = {
    id: 'XWAds',
    name: 'Shikhar',
    location: 'Mascot',
    joinedDate: 'December 2025',
    balance: '$63.70',
    verified: true,
    fullName: 'Shikhar Test',
    status: 'Active',
    role: 'Customer',
    gst: '-',
    businessName: 'ofdddsf',
    contact: 'Payment',
    email: 'shikhar+5@digisite.com.au',
    address: '150 Coward Street, Mascot NSW, Australia',
    postcode: '2020',
    markup: [
        { courier: 'Australia Post', markup: '0.00%', pickup: '$0.00' },
        { courier: 'Direct Freight Express', markup: '0.00%', pickup: '$0.00' }
    ]
};

export const MOCK_STATS = [
    { label: 'Total Order', value: '1', icon: Package, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: 'Total Wallet Balance', value: '$63.70', icon: Wallet, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: 'Total Pickup Charge', value: '$0.00', icon: MapPin, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
    { label: 'Total Credit', value: '$80.00', icon: TrendingUp, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
    { label: 'Total Debit', value: '$16.30', icon: TrendingDown, iconColor: 'text-red-500', iconBg: 'bg-red-50' },
    { label: 'Total Margin', value: '$0.00', icon: CreditCard, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
    { id: '1', type: 'login', title: 'User Logged In', description: 'Login from IP: 211.27.89.22', timestamp: '1 month ago' },
    { id: '2', type: 'logout', title: 'User Logged Out', description: 'Logout from IP: 211.27.89.22', timestamp: '1 month ago' },
    { id: '3', type: 'login', title: 'User Logged In', description: 'Login from IP: 211.27.89.22', timestamp: '1 month ago' },
    { id: '4', type: 'payment', title: 'Payment Received', description: 'Payment of $650.00 received via Bank Transfer for Invoice #0007', timestamp: '1 month ago', invoiceNo: '#0007' },
    { id: '5', type: 'login', title: 'User Logged In', description: 'Login from IP: 211.27.89.22', timestamp: '1 month ago' },
    { id: '6', type: 'payment', title: 'Payment Received', description: 'Payment of $300.00 received via Cash for Invoice #0006', timestamp: '1 month ago', invoiceNo: '#0006' },
    { id: '7', type: 'payment', title: 'Payment Received', description: 'Payment of $500.00 received via Bank Transfer for Invoice #0006', timestamp: '1 month ago', invoiceNo: '#0006' },
];

export const MOCK_ORDERS = [
    { orderNumber: '4P01000', date: '30/12/2025 01:21:59 PM', suburb: 'Chester Hill', amount: '$16.30', status: 'Payment Pending', paymentStatus: 'Payment Pending', courier: 'Auspost', orderType: 'Manual', consignmentDate: '30/12/2025 01:21:59 PM' }
];

export const MOCK_TRANSACTIONS = [
    { transactionId: 'pi_3SpiddBUFF6mLDX72mAMZEveF', amount: '$80.00', paymentStatus: 'Success', type: 'Credit', paymentDate: '30/12/2025' }
];

export const MOCK_INVOICES = [
    { id: '1', status: 'Paid', client: 'Shikhar', total: '$120.00', issuedDate: '20/12/2025', balance: '$0.00' },
    { id: '2', status: 'Unpaid', client: 'Shikhar', total: '$85.00', issuedDate: '22/12/2025', balance: '$85.00' },
];

export const CUSTOMER_TABS = ['Profile', 'Orders', 'Integration', 'Transaction', 'Credit Application', 'Invoice Management'];
