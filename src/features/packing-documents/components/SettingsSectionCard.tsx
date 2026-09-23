import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SettingsSectionCardProps {
    icon: LucideIcon
    title: string
    description: string
    /** Read-only users get no save bar and no preview. */
    disabled: boolean
    isDirty: boolean
    isSaving: boolean
    onSave: () => void
    onReset: () => void
    /** Omitted by sections that have no sample to render. */
    onPreview?: () => void
    isPreviewLoading?: boolean
    children: ReactNode
}

export function SettingsSectionCard({
    icon: Icon,
    title,
    description,
    disabled,
    isDirty,
    isSaving,
    onSave,
    onReset,
    onPreview,
    isPreviewLoading = false,
    children
}: SettingsSectionCardProps) {
    return (
        <Card className="gap-0">
            <CardHeader className="flex flex-row items-start justify-between gap-3 border-b border-gray-100 dark:border-zinc-800 py-4">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-[15px] font-bold text-gray-900 dark:text-zinc-100">
                        <Icon className="h-4 w-4 text-primary" />
                        {title}
                    </CardTitle>
                    <CardDescription className="text-[13px]">{description}</CardDescription>
                </div>
                {onPreview && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPreview}
                        disabled={disabled || isPreviewLoading}
                        className="h-8 shrink-0 gap-2 px-3 text-xs font-semibold"
                    >
                        {isPreviewLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                        Preview sample
                    </Button>
                )}
            </CardHeader>

            <CardContent className="p-4 sm:p-5">{children}</CardContent>

            {!disabled && (
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 px-4 py-2.5">
                    {isDirty && (
                        <span className="mr-auto text-[12px] font-medium text-amber-700 dark:text-amber-400">
                            Unsaved changes in this section
                        </span>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onReset}
                        disabled={!isDirty || isSaving}
                        className="h-8 px-3 text-xs font-semibold"
                    >
                        Reset
                    </Button>
                    <Button
                        type="button"
                        onClick={onSave}
                        disabled={!isDirty || isSaving}
                        className="h-8 gap-2 bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-hover"
                    >
                        {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Save
                    </Button>
                </div>
            )}
        </Card>
    )
}
