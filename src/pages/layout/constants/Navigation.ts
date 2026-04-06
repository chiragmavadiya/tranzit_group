import {
  CheckCircle2, Package, Search, Zap, Send, Calendar, Clock, BarChart2, Tag, Users, Box, Settings
} from 'lucide-react';
import type { SidebarItem } from '../types/Sidebar.types';

export const sidebarItems: SidebarItem[] = [
  // { name: 'Getting Setup', icon: CheckCircle2, path: '/setup' },
  { name: 'Orders', icon: Package, path: '/orders' },
  // { name: 'Search', icon: Search, path: '/search' },
  // { name: 'Workflows', icon: Zap, path: '/workflows' },
  // { name: 'Manifests', icon: Send, path: '/manifests' },
  // { name: 'Pickups', icon: Calendar, path: '/pickups' },
  { name: 'Reports pickup manifest worflow order', icon: Clock, path: '/reports' },
  // {
  //   name: 'Analytics',
  //   icon: BarChart2,
  //   path: '/analytics',
  //   hasDropdown: true,
  //   subGroups: [
  //     {
  //       title: 'ANALYTICS',
  //       items: [
  //         { name: 'Shipping summary', path: '/analytics/summary' },
  //         { name: 'Shipping performance', path: '/analytics/performance' },
  //       ]
  //     }
  //   ]
  // },
  // { name: 'Products', icon: Tag, path: '/products' },
  // { name: 'Address book', icon: Users, path: '/address-book' },
  // { name: 'Warehouse', icon: Box, path: '/warehouse' },
  // {
  //   name: 'Settings',
  //   icon: Settings,
  //   path: '/settings',
  //   hasDropdown: true,
  //   subGroups: [
  //     {
  //       title: 'GENERAL',
  //       items: [
  //         { name: 'Options', path: '/settings/options' },
  //         { name: 'Pickup address', path: '/settings/address' },
  //         { name: 'Printing', path: '/settings/printing' },
  //       ]
  //     },
  //     {
  //       title: 'CONNECT',
  //       items: [
  //         { name: 'Couriers', path: '/settings/couriers' },
  //         { name: 'Integrations', path: '/settings/integrations' },
  //         { name: 'CSV file', path: '/settings/csv' },
  //         { name: 'API', path: '/settings/api' },
  //       ]
  //     },
  //     {
  //       title: 'ORDER MANAGEMENT',
  //       items: [
  //         { name: 'Packaging', path: '/settings/packaging' },
  //         { name: 'Packing slip', path: '/settings/packing-slip' },
  //         { name: 'Packing validation', path: '/settings/validation' },
  //         { name: 'Product catalogue', path: '/settings/catalogue' },
  //         { name: 'Tags', path: '/settings/tags' },
  //       ]
  //     },
  //     {
  //       title: 'SHIPPING',
  //       items: [
  //         { name: 'Rules', path: '/settings/rules' },
  //         { name: 'Shipping zones', path: '/settings/zones' },
  //         { name: 'Checkout rates', path: '/settings/checkout-rates' },
  //         { name: 'Document manager', path: '/settings/document-manager' },
  //         { name: 'Digital signatures', path: '/settings/digital-signatures' },
  //         { name: 'Customise rates', path: '/settings/customise-rates' },
  //       ]
  //     },
  //     {
  //       title: 'POST PURCHASE',
  //       items: [
  //         { name: 'Brand hub', path: '/settings/brand-hub' },
  //         { name: 'Tracking and notifications', path: '/settings/notifications' },
  //         { name: 'Returns', path: '/settings/returns' },
  //       ]
  //     },
  //     {
  //       title: 'ACCOUNT MANAGEMENT',
  //       items: [
  //         { name: 'Users', path: '/settings/users' },
  //       ]
  //     }
  //   ]
  // },
];
