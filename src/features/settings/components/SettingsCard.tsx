import { memo } from "react";
import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Setting } from "@/features/settings/types";
import { cn } from "@/lib/utils";
import { CustomTooltip } from "@/components/common";

interface SettingsCardProps {
    setting: Setting;
    onEdit: (setting: Setting) => void;
}

export const SettingsCard = memo(function SettingsCard({ setting, onEdit }: SettingsCardProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1",
            "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-blue-50/50 before:to-transparent dark:before:from-blue-900/10 before:opacity-0 before:transition-opacity hover:before:opacity-100"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <Settings2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight line-clamp-1 my-0">
                        <CustomTooltip title={setting.name}>
                            {setting.name}
                        </CustomTooltip>
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400">
                        {setting.slug}
                    </Badge>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-50 dark:border-zinc-900/50 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ID: #{setting.id}
                </span>
                <button
                    onClick={() => onEdit(setting)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                >
                    Update Setting
                </button>
            </div>
        </div>
    );
});
