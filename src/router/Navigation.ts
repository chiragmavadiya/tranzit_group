import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  // UserCog,
  FileText,
  // Link,
  Wallet,
  MessageSquare,
  Settings,
  // Activity,
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
  Globe,
  BarChart3,
  MessageSquareMore,
  PackageMinus,
  Route
} from 'lucide-react';
import type { SidebarItem } from '../layout/types/Sidebar.types';

export const adminSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Customer Management', icon: Users, path: '/admin/customers' },
  { name: 'Order Management', icon: Package, path: '/admin/orders' },
  { name: 'Cancel Order', icon: PackageX, path: '/admin/cancel-order' },
  { name: 'Book a pickup', icon: Truck, path: '/admin/book-pickup' },
  // { name: 'Staff / Sub User Management', icon: UserCog, path: '/admin/staff' },


  // { name: 'Customer Parcel Report', icon: FileText, path: '/admin/customer-parcel-report' },
  {
    name: 'Reports',
    icon: BarChart3,
    path: '/admin/customer-parcel-report',
    hasDropdown: true,
    subItems: [
      { name: 'All Tranzit Group Courier Parcel Report', path: '/admin/customer-parcel-report' },
      { name: 'Custom Integrated Courier Parcel Report', path: '/admin/integrated-parcel-report' },
    ]
  },


  { name: 'Invoice Management', icon: FileText, path: '/admin/invoices' },
  // { name: 'Zoho Invoice Integration', icon: Link, path: '/admin/zoho-integration' },
  { name: 'Topup Management', icon: Wallet, path: '/admin/topup' },
  // { name: 'Courier Surcharge', icon: Percent, path: '/admin/courier-surcharge' },
  // { name: 'Courier base Postcode', icon: MapPin, path: '/admin/courier-postcode' },
  { name: 'Enquiry Management', icon: MessageSquareMore, path: '/admin/enquiry' },
  { name: 'Help Center Management', icon: LifeBuoy, path: '/admin/help-center' },
  { name: 'System Settings', icon: Settings, path: '/admin/settings' },
  // { name: 'Admin Activity Log', icon: Activity, path: '/admin/activity-log' },
  { name: 'Order Summary For Auspost', icon: ClipboardList, path: '/admin/order-summary' },
  { name: 'Undelivered Parcel', icon: PackageMinus, path: '/admin/undelivered' },
  { name: 'Customer Quote', icon: FileQuestion, path: '/admin/quotes' },

  {
    name: 'Courier Global Settings',
    icon: Route,
    path: '/admin/courier-surcharge',
    hasDropdown: true,
    subItems: [
      { name: 'Courier Surcharge', path: '/admin/courier-surcharge' },
      { name: 'Courier base Postcode', path: '/admin/courier-postcode' },
    ]
  },

  {
    name: 'Global Settings',
    icon: Globe,
    path: '/admin/zoho-integration',
    hasDropdown: true,
    subItems: [
      { name: 'Zoho Invoice Integration', path: '/admin/zoho-integration' },
      { name: 'Admin Activity Log', path: '/admin/activity-log' },
      { name: 'Profile', path: '/admin/profile' },
    ]
  },


  // { name: 'Profile', icon: User, path: '/admin/profile' },
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
          { name: 'Rule Management', path: '/settings/rules', icon: Route },
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
  // { name: 'Help', icon: LifeBuoy, path: 'mailto:info@tranzitgroup.com.au?subject=Support Request from Portal&body=Hi Team', isExternal: true },
];
