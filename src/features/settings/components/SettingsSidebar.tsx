import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { SettingCategory } from '../types';
import { Settings2, Mail, Truck, Layout, ShieldCheck, Globe } from "lucide-react";

interface SettingsSidebarProps {
  categories: SettingCategory[];
  isLoading: boolean;
}

// Map slug to icon
const ICON_MAP: Record<string, any> = {
  general: Settings2,
  email: Mail,
  courier: Truck,
  appearance: Layout,
  security: ShieldCheck,
  localization: Globe,
};

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ categories, isLoading }) => {
  const renderCategoryLink = (category: SettingCategory) => {
    const Icon = ICON_MAP[category.slug] || Settings2;

    return (
      <NavLink
        key={category.id}
        to={`/admin/settings/${category.slug}`}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-5 py-2 rounded-lg text-sm transition-all duration-200 group relative',
            isActive
              ? 'bg-blue-50 text-blue-700 font-medium dark:text-blue-400 '
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
          )
        }
      >
        <div className={cn(
          "p-1.5 rounded-lg transition-colors",
          "bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm",
          "group-hover:border-[#0060FE]/30 group-hover:bg-[#0060FE]/5"
        )}>
          <Icon className="w-4 h-4 shrink-0" />
        </div>
        <span className="truncate">{category.name}</span>

        {/* <NavLink to={`/admin/settings/${category.slug}`}>
          {({ isActive }) => isActive && (
            <div className="absolute left-0 w-1 h-6 bg-[#0060FE] rounded-r-full" />
          )}
        </NavLink> */}
      </NavLink>
    );
  };

  if (isLoading) {
    return (
      <aside className="w-72 border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 flex flex-col p-6 gap-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-6">
        <div className="px-4 mb-2">
          <h3 className="my-0 text-[11px] font-black text-slate-600 dark:text-zinc-500 uppercase tracking-wider">
            Configuration
          </h3>
        </div>
        <div className="space-y-0.5">
          {categories.map(renderCategoryLink)}
        </div>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
