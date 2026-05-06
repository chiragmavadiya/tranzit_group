import { FileText } from 'lucide-react';
import type { ActivityItem } from './types';

export const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-widest my-0">{title}</h3>
    </div>
);

export const DetailItem = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
    <div className="flex items-start gap-3 py-1.5">
        <Icon className="h-4 w-4 text-slate-400 shrink-0 -mt-[4px]" />
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider leading-none mb-1">{label}</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{value}</span>
        </div>
    </div>
);

export const TimelineItem = ({ item, isLast }: { item: ActivityItem, isLast: boolean }) => {
    const getIcon = () => {
        switch (item.type) {
            case 'login': return <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />;
            case 'logout': return <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />;
            case 'payment': return <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />;
            default: return <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />;
        }
    };

    return (
        <div className="relative flex gap-4 pb-6">
            {!isLast && (
                <div className="absolute left-[5px] top-4 h-[calc(100%-16px)] w-[1px] bg-slate-100 dark:bg-zinc-800" />
            )}
            <div className="mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                {getIcon()}
            </div>
            <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{item.title}</h4>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
                {item.invoiceNo && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-zinc-900/50 p-2 border border-slate-100 dark:border-zinc-800 w-fit">
                        <FileText className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-widest">Invoice {item.invoiceNo}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
