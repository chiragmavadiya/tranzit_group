import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({ title, icon: Icon, className, action, children }: SectionCardProps) => {
  return (
    <Card className={cn('rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950 py-3', className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <h3 className="my-0 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
