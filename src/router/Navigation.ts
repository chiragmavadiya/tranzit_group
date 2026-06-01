import {
  LayoutDashboard,
  Users,
  Package,
  XCircle,
  Truck,
  UserCog,
  FileText,
  FileSpreadsheet,
  Link,
  Wallet,
  Percent,
  MapPin,
  MessageSquare,
  HelpCircle,
  Settings,
  Activity,
  ClipboardList,
  PackageX,
  FileQuestion,
  User,
  PlusCircle,
  Calculator,
  Box,
  BookOpen,
  FileBarChart,
  // FileArchive,
  LifeBuoy,
  Globe
} from 'lucide-react';
import type { SidebarItem } from '../layout/types/Sidebar.types';

export const adminSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Customer Management', icon: Users, path: '/admin/customers' },
  { name: 'Order Management', icon: Package, path: '/admin/orders' },
  { name: 'Cancel Order', icon: XCircle, path: '/admin/cancel-order' },
  { name: 'Book a pickup', icon: Truck, path: '/admin/book-pickup' },
  { name: 'Staff / Sub User Management', icon: UserCog, path: '/admin/staff' },
  { name: 'Customer Parcel Report', icon: FileText, path: '/admin/customer-parcel-report' },
  { name: 'Invoice Management', icon: FileSpreadsheet, path: '/admin/invoices' },
  { name: 'Zoho Invoice Integration', icon: Link, path: '/admin/zoho-integration' },
  { name: 'Topup Management', icon: Wallet, path: '/admin/topup' },
  { name: 'Courier Surcharge', icon: Percent, path: '/admin/courier-surcharge' },
  { name: 'Courier base Postcode', icon: MapPin, path: '/admin/courier-postcode' },
  { name: 'Enquiry Management', icon: MessageSquare, path: '/admin/enquiry' },
  { name: 'Help Center Management', icon: HelpCircle, path: '/admin/help-center' },
  { name: 'System Settings', icon: Settings, path: '/admin/settings' },
  { name: 'Admin Activity Log', icon: Activity, path: '/admin/activity-log' },
  { name: 'Order Summary For Auspost', icon: ClipboardList, path: '/admin/order-summary' },
  { name: 'Undelivered Parcel', icon: PackageX, path: '/admin/undelivered' },
  { name: 'Customer Quote', icon: FileQuestion, path: '/admin/quotes' },

  { name: 'Profile', icon: User, path: '/admin/profile' },
];

const getOrderTab = () => localStorage.getItem('order_tab');

export const clientSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    name: 'Orders',
    icon: Package,
    get path() {
      return `/orders?tab=${getOrderTab() || 'new'}`;
    }
  },
  { name: 'Create Order', icon: PlusCircle, path: '/orders/create' },
  { name: 'Get Quote', icon: Calculator, path: '/quote' },
  {
    name: 'My Wallet',
    icon: Wallet,
    path: '/wallet/transactions',
    // hasDropdown: true,
    // subItems: [
    // { name: 'Transactions', path: '/wallet/transactions' },
    // { name: 'Top Up', path: '/wallet/top-up' },
    // ]

  },
  { name: 'My Items', icon: Box, path: '/items' },
  { name: 'My Address Book', icon: BookOpen, path: '/address-book' },
  {
    name: 'Report',
    icon: FileBarChart,
    path: '/reports',
    hasDropdown: true,
    subItems: [
      { name: 'All Report', path: '/reports' },
      { name: 'Parcel Report', path: '/parcel-report' },
    ]
  },
  { name: 'Invoices', icon: FileText, path: '/invoices' },
  { name: 'Enquiry', icon: MessageSquare, path: '/enquiry' },
  // { name: 'Help Center', icon: HelpCircle, path: '/help-center' }, // NEED TO CHECK CODE
  // { name: 'Parcel Report', icon: FileArchive, path: '/parcel-report' },
  // { name: 'Integrations', icon: Link, path: '/integrations' },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
    hasDropdown: true,
    subGroups: [
      {
        title: 'Organization',
        items: [
          { name: 'Account Details', path: '/settings/account', icon: User },
          { name: 'Team Access', path: '/settings/team', icon: Users },
        ]
      },
      {
        title: 'Integrations',
        items: [
          { name: 'Ecommerce', path: '/settings/ecommerce', icon: Globe },
          { name: 'Carriers', path: '/settings/carriers', icon: Truck },
        ]
      },
    ]
  },
  { name: 'Help', icon: LifeBuoy, path: 'mailto:info@tranzitgroup.com.au?subject=Support Request from Portal&body=Hi Team', isExternal: true },
];
