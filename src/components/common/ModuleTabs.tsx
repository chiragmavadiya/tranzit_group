import { cn } from '@/lib/utils';

const ModuleTabs = ({
    tab,
    onTabChange,
    isActive,
    count,
}: {
    tab: string;
    onTabChange: (tab: string) => void;
    isActive: boolean;
    count: number;
}) => {
    return (
        <button
            onClick={() => onTabChange(tab)}
            className={cn(
                "h-10 px-4 border cursor-pointer capitalize font-medium text-sm rounded-t-md transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
                isActive
                    ? "border-gray-200 border-b-slate-100  font-bold text-primary dark:border-zinc-800 dark:border-b-zinc-950"
                    : "border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 "
            )}
        >
            {tab}
            {typeof count === 'number' && (
                <div className={cn(
                    "px-2 text-[10px] leading-none h-4 flex items-center justify-center rounded-full font-medium transition-all duration-300",
                    isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
                )}>
                    {count}
                </div>
            )}
        </button>
    )
}

export default ModuleTabs