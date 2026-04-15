import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface ConformationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    loading?: boolean;
    className?: string;
}

export function ConformationModal({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'default',
    loading = false,
    className,
}: ConformationModalProps) {
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onOpenChange(false);
    };

    const handleConfirm = () => {
        onConfirm();
        // Usually onConfirm might be async, but for a generic component 
        // we let the caller handle closing if needed, or we close it here 
        // if it's a simple confirmation.
        // In many cases, it's safer to let the caller decide.
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                // className={cn("sm:max-w-[440px] bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-0 overflow-hidden", className)}
                className={className}
            >
                {/* <div className="p-6"> */}
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {/* </div> */}

                <DialogFooter className="bg-slate-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-4 h-10 font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cn(
                            "px-4 h-10 font-semibold transition-all shadow-sm active:scale-95",
                            confirmVariant === 'default' && "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 dark:shadow-none"
                        )}
                    >
                        {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
