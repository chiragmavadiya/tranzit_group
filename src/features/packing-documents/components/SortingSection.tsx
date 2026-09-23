import { ArrowDownUp } from 'lucide-react'
import { FormSelect } from '@/features/orders/components/OrderFormUI'
import {
    DEFAULT_PACKING_DOCUMENTS_CONFIGURATION,
    PACKING_DOCUMENTS_SORT_BY_OPTIONS,
    PACKING_DOCUMENTS_SORT_ORDER_OPTIONS
} from '../constants/packing-documents.constants'
import type {
    PackingDocumentsSortBy,
    PackingDocumentsSorting,
    PackingDocumentsSortOrder
} from '../types/packing-documents.types'
import { SettingsSectionCard } from './SettingsSectionCard'

const DEFAULT_SORTING = DEFAULT_PACKING_DOCUMENTS_CONFIGURATION.sorting

interface SortingSectionProps {
    settings: PackingDocumentsSorting
    disabled: boolean
    isDirty: boolean
    isSaving: boolean
    onChange: (patch: Partial<PackingDocumentsSorting>) => void
    onSave: () => void
    onReset: () => void
}

export function SortingSection({
    settings,
    disabled,
    isDirty,
    isSaving,
    onChange,
    onSave,
    onReset
}: SortingSectionProps) {
    return (
        <SettingsSectionCard
            icon={ArrowDownUp}
            title="Shared Sorting"
            description="Sets the order items are listed in on both packing slips and packing summaries."
            disabled={disabled}
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={onSave}
            onReset={onReset}
        >
            <div className="grid grid-cols-12 gap-3 sm:max-w-2xl">
                <FormSelect
                    label="Sort by"
                    value={settings.sort_by}
                    onValueChange={(value) => onChange({ sort_by: (value || DEFAULT_SORTING.sort_by) as PackingDocumentsSortBy })}
                    options={PACKING_DOCUMENTS_SORT_BY_OPTIONS}
                    disabled={disabled}
                    allowClear={false}
                    searchdisable
                    isHalf
                />
                <FormSelect
                    label="Sort order"
                    value={settings.sort_order}
                    onValueChange={(value) => onChange({ sort_order: (value || DEFAULT_SORTING.sort_order) as PackingDocumentsSortOrder })}
                    options={PACKING_DOCUMENTS_SORT_ORDER_OPTIONS}
                    disabled={disabled}
                    allowClear={false}
                    searchdisable
                    isHalf
                />
            </div>
        </SettingsSectionCard>
    )
}
