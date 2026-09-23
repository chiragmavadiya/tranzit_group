import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ModuleTabs = ({
    tab,
    onTabChange,
    isActive,
    count,
    tabKey,
    showCount = true
}: {
    tab: string;
    onTabChange: (tab: string) => void;
    isActive: boolean;
    count: number;
    tabKey?: string;
    showCount?: boolean
}) => {
    return (
        <button
            onClick={() => onTabChange(tab)}
            className={cn(
<<<<<<< HEAD
                "pb-3 pt-2 px-1 cursor-pointer capitalize  text-[13px] sm:text-sm transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
                isActive
                    ? "text-primary font-bold"
=======
                "pb-3 pt-2 px-1 cursor-pointer capitalize font-semibold text-[13px] sm:text-sm transition-all duration-200 relative flex items-center gap-2 outline-none whitespace-nowrap",
                isActive
                    ? "text-primary font-semibold"
>>>>>>> 0e6e9b67246e905519767a76639d2addfe06681c
                    : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
            )}
        >
            {tabKey || tab}
            {showCount && typeof count === 'number' && (
                <span className={cn(
                    "px-1.5 py-0.5 text-[10px] rounded-full transition-all duration-300",
                    isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
                )}>
                    {count}
                </span>
            )}
            {isActive && (
                <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}
        </button>
    )
}

export default ModuleTabs;