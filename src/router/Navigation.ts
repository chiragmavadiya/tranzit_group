import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  UserCog,
  FileText,
  // Link,
  Wallet,
  MessageSquare,
  Settings,
  // Activity,
  ClipboardList,
  Printer,
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
  Route,
  Bug,
} from 'lucide-react';
import type { SidebarItem } from '../layout/types/Sidebar.types';
import { MODULE_PERMISSIONS } from '../constants';

export const adminSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard, path: '/admin/dashboard', permissions: MODULE_PERMISSIONS.dashboard },
  { name: 'Customer Management', key: 'customer', icon: Users, path: '/admin/customers', permissions: MODULE_PERMISSIONS.customer },
  { name: 'Order Management', key: 'order', icon: Package, path: '/admin/orders', permissions: MODULE_PERMISSIONS.order },
  { name: 'Cancel Order', key: 'cancel_order', icon: PackageX, path: '/admin/cancel-order', permissions: ['view_cancel_order'] },
  { name: 'Customer Quote', key: 'Customer Quote', icon: FileQuestion, path: '/admin/quotes', permissions: MODULE_PERMISSIONS['Customer Quote'] },
  { name: 'Book a pickup', key: 'book_pickup', icon: Truck, path: '/admin/book-pickup', permissions: MODULE_PERMISSIONS['Book a Pickup'] },
  { name: 'Staff / Sub User Management', key: 'subuser', icon: UserCog, path: '/admin/staff', permissions: MODULE_PERMISSIONS.subuser },


  // { name: 'Customer Parcel Report', icon: FileText, path: '/admin/customer-parcel-report' },
  {
    name: 'Reports',
    key: 'report',
    icon: BarChart3,
    path: '/admin/customer-parcel-report',
    hasDropdown: true,
    permissions: [...(MODULE_PERMISSIONS['Customer Parcel Report'] || []), ...(MODULE_PERMISSIONS.report || [])],
    subItems: [
<<<<<<< HEAD
      { name: 'All Reports', path: '/admin/all-reports', permissions: MODULE_PERMISSIONS.report },
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
      { name: 'Auspost Report', path: '/admin/auspost-report', permissions: MODULE_PERMISSIONS.report },
      { name: 'All Tranzit Group Courier Parcel Report', path: '/admin/customer-parcel-report', permissions: MODULE_PERMISSIONS['Customer Parcel Report'] },
      { name: 'Custom Integrated Courier Parcel Report', path: '/admin/integrated-parcel-report', permissions: MODULE_PERMISSIONS.report },
      { name: 'Order Label Charges', path: '/admin/order-label-charges', permissions: MODULE_PERMISSIONS.report },
    ]
  },


  { name: 'Invoice Management', key: "invoice", icon: FileText, path: '/admin/invoices', permissions: MODULE_PERMISSIONS.invoice },
  { name: 'Transaction Management', key: 'topup', icon: Wallet, path: '/admin/topup', permissions: MODULE_PERMISSIONS.topup },
  // { name: 'Courier Surcharge', icon: Percent, path: '/admin/courier-surcharge' },
  // { name: 'Courier base Postcode', icon: MapPin, path: '/admin/courier-postcode' },
  { name: 'Enquiry Management', key: 'Enquiry Management', icon: MessageSquareMore, path: '/admin/enquiry', permissions: MODULE_PERMISSIONS['Enquiry Management'] },
  { name: 'Help Center Management', key: 'Help Center', icon: LifeBuoy, path: '/admin/help-center', permissions: MODULE_PERMISSIONS['Help Center'] },
  { name: 'System Settings', icon: Settings, path: '/admin/settings', permissions: MODULE_PERMISSIONS.setting },
  // { name: 'Admin Activity Log', icon: Activity, path: '/admin/activity-log' },
  { name: 'Order Summary For Auspost', key: 'AusPost Order Summary', icon: ClipboardList, path: '/admin/order-summary', permissions: MODULE_PERMISSIONS['AusPost Order Summary'] },
  { name: 'Undelivered Parcel', key: 'Un-Delivered Parcel', icon: PackageMinus, path: '/admin/undelivered', permissions: MODULE_PERMISSIONS['Un-Delivered Parcel'] },

  {
    name: 'Courier Global Settings',
    icon: Route,
    path: '/admin/courier-surcharge',
    hasDropdown: true,
    permissions: [...(MODULE_PERMISSIONS['Courier Surcharge'] || []), ...(MODULE_PERMISSIONS['Courier Base Postcode'] || [])],
    subItems: [
      { name: 'Courier Surcharge', key: 'Courier Surcharge', path: '/admin/courier-surcharge', permissions: MODULE_PERMISSIONS['Courier Surcharge'] },
      { name: 'Courier base Postcode', key: 'Courier Base Postcode', path: '/admin/courier-postcode', permissions: MODULE_PERMISSIONS['Courier Base Postcode'] },
    ]
  },

  { name: 'Debug Centre', key: 'debug_centre', icon: Bug, path: '/admin/debug-centre', permissions: [] },

  {
    name: 'Global Settings',
    icon: Globe,
    path: '/admin/xero-integration',
    hasDropdown: true,
    permissions: [...(MODULE_PERMISSIONS.setting || []), ...(MODULE_PERMISSIONS['Admin Activity Log'] || []), ...(MODULE_PERMISSIONS.profile || [])],
    subItems: [
      { name: 'Xero Integration', key: 'setting', path: '/admin/xero-integration', permissions: MODULE_PERMISSIONS.setting },
      { name: 'Admin Activity Log', key: 'Admin Activity Log', path: '/admin/activity-log', permissions: MODULE_PERMISSIONS['Admin Activity Log'] },
      { name: 'Profile', key: 'profile', path: '/admin/profile', permissions: MODULE_PERMISSIONS.profile },
      { name: 'Global Configuration', key: 'setting', path: '/admin/global-config', permissions: MODULE_PERMISSIONS.setting },
      { name: 'Blackout Days', key: 'setting', path: '/admin/blackout-days', permissions: MODULE_PERMISSIONS.setting },
    ]
  },


  // { name: 'Profile', icon: User, path: '/admin/profile' },
];

const getOrderTab = () => localStorage.getItem('order_tab');

export const clientSidebarItems: SidebarItem[] = [
  { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  {
    name: 'Orders',
    key: 'order',
    icon: Package,
    get path() {
      return `/orders?tab=${getOrderTab() || 'new'}`;
    }
  },
  { name: 'Create Order', key: 'order', icon: PlusCircle, path: '/orders/create' },
  { name: 'Get Quote', key: 'get_quote', icon: Calculator, path: '/quote' },
  { name: 'Manifest Orders', key: 'manifest_order', icon: ClipboardList, path: '/manifest' },
  {
    name: 'My Wallet',
    key: 'my_wallet',
    icon: Wallet,
    path: '/wallet/transactions',
    // hasDropdown: true,
    // subItems: [
    // { name: 'Transactions', path: '/wallet/transactions' },
    // { name: 'Top Up', path: '/wallet/top-up' },
    // ]

  },
  { name: 'My Items', key: 'my_items', icon: Box, path: '/items' },
  { name: 'My Address Book', key: 'my_address_book', icon: BookOpen, path: '/address-book' },
  {
    name: 'Report',
    key: 'report',
    icon: FileBarChart,
    path: '/reports',
    hasDropdown: true,
    subItems: [
      { name: 'All Report', key: 'report', path: '/reports' },
      { name: 'Parcel Report', key: 'report', path: '/parcel-report' },
    ]
  },
  { name: 'Invoices', key: 'invoice', icon: FileText, path: '/invoices' },
  { name: 'Enquiry', key: 'enquiry', icon: MessageSquare, path: '/enquiry' },
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
          { name: 'Account Details', key: 'settings_account_detail', path: '/settings/account', icon: User },
          { name: 'Team Access', key: 'settings_team_access', path: '/settings/team', icon: Users },
          { name: 'Rule Management', key: 'settings_rule_management', path: '/settings/rules', icon: Route },
<<<<<<< HEAD
          { name: 'Packing Slips & Summary', key: 'settings_packing_documents', path: '/settings/packing-slips-summary', icon: Printer },
=======
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
        ]
      },
      {
        title: 'Integrations',
        items: [
          { name: 'Ecommerce', key: 'settings_integrations', path: '/settings/ecommerce', icon: Globe },
          { name: 'Carriers', key: 'settings_integrations', path: '/settings/carriers', icon: Truck },
        ]
      },
    ]
  },
  // { name: 'Help', icon: LifeBuoy, path: 'mailto:info@tranzitgroup.com.au?subject=Support Request from Portal&body=Hi Team', isExternal: true },
];
