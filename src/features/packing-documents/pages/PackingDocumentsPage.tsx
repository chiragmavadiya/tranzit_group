import { useCallback, useEffect, useMemo, useState } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/hooks/store.hooks'
import { PackingSlipSection } from '../components/PackingSlipSection'
import { PackingSummarySection } from '../components/PackingSummarySection'
import { SortingSection } from '../components/SortingSection'
import {
    usePackingDocumentsSorting,
    usePackingSlipSample,
    usePackingSlipSettings,
    usePackingSummarySample,
    usePackingSummarySettings,
    useSavePackingDocumentsSorting,
    useSavePackingSlipSettings,
    useSavePackingSummarySettings
} from '../hooks/usePackingDocuments'
import type {
    PackingDocumentsConfiguration,
    PackingDocumentsSorting,
    PackingSlipSettings,
    PackingSummaryOptions
} from '../types/packing-documents.types'
import { normalizeSummary, toConfiguration } from '../utils/packing-documents.utils'

const PackingDocumentsSkeleton = () => (
    <div className="space-y-4">
        {[280, 240, 150].map((height, index) => (
            <div
                key={index}
                className="rounded-md border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3"
            >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-72 max-w-full" />
                <Skeleton className="w-full rounded-md" style={{ height }} />
            </div>
        ))}
    </div>
)

export default function PackingDocumentsPage() {
    const { is_sub_user, team_access } = useAppSelector((state) => state.auth)
    // No backend permission for this module yet, so an absent key means full access,
    // matching `hasCustomerPermission`.
    const canReadWrite = useMemo(
        () => !is_sub_user || (team_access?.permissions?.settings_packing_documents ?? 'full') === 'full',
        [is_sub_user, team_access]
    )

    const slipQuery = usePackingSlipSettings()
    const summaryQuery = usePackingSummarySettings()
    const sortingQuery = usePackingDocumentsSorting()
    const saveSlipMutation = useSavePackingSlipSettings()
    const saveSummaryMutation = useSavePackingSummarySettings()
    const saveSortingMutation = useSavePackingDocumentsSorting()
    const sampleMutation = usePackingSlipSample()
    const summarySampleMutation = usePackingSummarySample()

    const [form, setForm] = useState<PackingDocumentsConfiguration | null>(null)
    const [baseline, setBaseline] = useState<PackingDocumentsConfiguration | null>(null)

    const isLoading = slipQuery.isLoading || summaryQuery.isLoading || sortingQuery.isLoading
    const loadError = slipQuery.error || summaryQuery.error || sortingQuery.error

    // Populate once: a background refetch must never overwrite in-progress edits.
    useEffect(() => {
        if (isLoading || loadError || baseline) return
        const loaded = toConfiguration(slipQuery.data, summaryQuery.data, sortingQuery.data)
        setBaseline(loaded)
        setForm(loaded)
    }, [isLoading, loadError, baseline, slipQuery.data, summaryQuery.data, sortingQuery.data])

    // Per section, so saving one never touches the other endpoints.
    const dirty = useMemo(() => {
        const changed = (key: keyof PackingDocumentsConfiguration) =>
            Boolean(form && baseline) && JSON.stringify(form?.[key]) !== JSON.stringify(baseline?.[key])
        return {
            slip: changed('packing_slip'),
            summary: changed('packing_summary'),
            sorting: changed('sorting')
        }
    }, [form, baseline])

    const isDirty = dirty.slip || dirty.summary || dirty.sorting

    // The app mounts a BrowserRouter rather than a data router, so `useBlocker` is
    // unavailable; this covers reload and browser back/forward.
    useEffect(() => {
        if (!isDirty) return
        const warnBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault()
            event.returnValue = ''
        }
        window.addEventListener('beforeunload', warnBeforeUnload)
        return () => window.removeEventListener('beforeunload', warnBeforeUnload)
    }, [isDirty])

    const updateSlip = useCallback((patch: Partial<PackingSlipSettings>) => {
        setForm((prev) => {
            if (!prev) return prev
            const packing_slip = { ...prev.packing_slip, ...patch }
            // Only one reference fits the order number barcode, so the one just
            // switched on wins.
            if (patch.use_our_ref_barcode) packing_slip.use_their_ref_barcode = false
            if (patch.use_their_ref_barcode) packing_slip.use_our_ref_barcode = false
            return { ...prev, packing_slip }
        })
    }, [])

    const updateSummary = useCallback((patch: Partial<PackingSummaryOptions>) => {
        setForm((prev) => (prev
            ? { ...prev, packing_summary: normalizeSummary({ ...prev.packing_summary, ...patch }) }
            : prev))
    }, [])

    const updateSorting = useCallback((patch: Partial<PackingDocumentsSorting>) => {
        setForm((prev) => (prev ? { ...prev, sorting: { ...prev.sorting, ...patch } } : prev))
    }, [])

    // Re-baseline only the saved section, so a failure elsewhere keeps its edits.
    const rebaseline = <K extends keyof PackingDocumentsConfiguration>(key: K) =>
        setBaseline((prev) => (prev && form ? { ...prev, [key]: form[key] } : prev))

    const resetSection = <K extends keyof PackingDocumentsConfiguration>(key: K) =>
        setForm((prev) => (prev && baseline ? { ...prev, [key]: baseline[key] } : prev))

    return (
        <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            {/* Pulled out over the settings layout's page padding so nothing scrolls
                into the gap above it. */}
            <div className="sticky -top-page-padding z-20 -mx-page-padding -mt-page-padding flex flex-col gap-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-page-padding pt-page-padding pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Printer className="h-5 w-5 shrink-0 text-gray-700 dark:text-zinc-300" />
                        <h1 className="my-0 text-xl font-extrabold text-gray-950 dark:text-zinc-100">
                            Packing Slips &amp; Summary
                        </h1>
                        {isDirty && (
                            <span className="rounded-sm bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                Unsaved changes
                            </span>
                        )}
                    </div>
                    <p className="my-0 text-sm text-gray-500 dark:text-zinc-400 sm:pl-7">
                        Configure how your packing slips and packing summaries are generated.
                        Each section saves on its own.
                    </p>
                </div>
            </div>

            {isLoading || !form ? (
                <PackingDocumentsSkeleton />
            ) : loadError ? (
                <div className="rounded-md border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6 text-center">
                    <p className="my-0 text-sm font-semibold text-red-700 dark:text-red-300">
                        We couldn't load your packing document settings.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => { slipQuery.refetch(); summaryQuery.refetch(); sortingQuery.refetch() }}
                        className="mt-3 h-8 px-4 text-xs font-semibold"
                    >
                        Try again
                    </Button>
                </div>
            ) : (
                <div className="space-y-4 pb-4">
                    <PackingSlipSection
                        settings={form.packing_slip}
                        disabled={!canReadWrite}
                        isPreviewLoading={sampleMutation.isPending}
                        isDirty={dirty.slip}
                        isSaving={saveSlipMutation.isPending}
                        onChange={updateSlip}
                        onPreview={() => sampleMutation.mutate(form.packing_slip)}
                        onSave={() => saveSlipMutation.mutate(form.packing_slip, {
                            onSuccess: () => rebaseline('packing_slip')
                        })}
                        onReset={() => resetSection('packing_slip')}
                    />
                    <PackingSummarySection
                        settings={form.packing_summary}
                        disabled={!canReadWrite}
                        isDirty={dirty.summary}
                        isSaving={saveSummaryMutation.isPending}
                        isPreviewLoading={summarySampleMutation.isPending}
                        onChange={updateSummary}
                        onPreview={() => summarySampleMutation.mutate(form.packing_summary)}
                        onSave={() => saveSummaryMutation.mutate(form.packing_summary, {
                            onSuccess: () => rebaseline('packing_summary')
                        })}
                        onReset={() => resetSection('packing_summary')}
                    />
                    <SortingSection
                        settings={form.sorting}
                        disabled={!canReadWrite}
                        isDirty={dirty.sorting}
                        isSaving={saveSortingMutation.isPending}
                        onChange={updateSorting}
                        onSave={() => saveSortingMutation.mutate(form.sorting, {
                            onSuccess: () => rebaseline('sorting')
                        })}
                        onReset={() => resetSection('sorting')}
                    />
                </div>
            )}
        </div>
    )
}
