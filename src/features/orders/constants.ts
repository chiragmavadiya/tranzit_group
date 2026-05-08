import type { TabType } from '@/features/orders/types';

export const TABS: TabType[] = ['New', 'Printed', 'Shipped', 'Archived'];

export const Order_status_styles: Record<string, string> = {
  New: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Shipped: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Archived: 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700',
  'Courier Not Assigned': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  'Paid': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  'Printed': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
  'Payment pending': 'bg-amber-100 text-amber-600 dark:bg-blue-900/20 dark:text-blue-400',
  'Partial': 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  'Unpaid': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  'Draft': 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

