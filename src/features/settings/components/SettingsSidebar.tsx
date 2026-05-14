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
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
          )
        }
      >
        <div className={cn(
          "p-1.5 rounded-lg transition-all duration-200",
          "bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm",
          "group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary",
          "group-[.active]:border-primary/50 group-[.active]:bg-primary/10 group-[.active]:text-primary"
        )}>
          <Icon className="w-4 h-4 shrink-0" />
        </div>
        <span className="truncate">{category.name}</span>
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
