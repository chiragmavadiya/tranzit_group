import {
    DEFAULT_PACKING_DOCUMENTS_CONFIGURATION,
    PACKING_DOCUMENTS_SORT_BY_OPTIONS,
    PACKING_DOCUMENTS_SORT_ORDER_OPTIONS,
    PACKING_SLIP_TEMPLATES,
    PACKING_SUMMARY_TEMPLATES
} from '../constants/packing-documents.constants'
import type {
    PackingDocumentsConfiguration,
    PackingDocumentsSorting,
    PackingSlipSettings,
    PackingSummaryOptions
} from '../types/packing-documents.types'

const pickOption = <T extends string>(value: unknown, allowed: readonly { value: T }[], fallback: T): T =>
    allowed.some((option) => option.value === value) ? (value as T) : fallback

const defaults = DEFAULT_PACKING_DOCUMENTS_CONFIGURATION

/**
 * Applied both on load and on every edit so the two paths can never disagree about
 * what a valid combination looks like.
 */
export const normalizeSummary = (summary: PackingSummaryOptions): PackingSummaryOptions =>
    summary.summary_template === 'items'
        ? summary
        : { ...summary, summary_include_color_size: false, summary_include_bin: false }

/**
 * Unknown enum values are coerced to the defaults, so a template the portal does not
 * offer can never leave the form with nothing selected.
 */
export const toConfiguration = (
    slip: PackingSlipSettings | undefined,
    summary: PackingSummaryOptions | undefined,
    sorting: PackingDocumentsSorting | undefined
): PackingDocumentsConfiguration => ({
    packing_slip: {
        template: pickOption(slip?.template, PACKING_SLIP_TEMPLATES, defaults.packing_slip.template),
        display_item_barcode: Boolean(slip?.display_item_barcode),
        rotate_packing_slip: Boolean(slip?.rotate_packing_slip),
        use_our_ref_barcode: Boolean(slip?.use_our_ref_barcode),
        // Only one reference fits the order number barcode; on load, ours wins.
        use_their_ref_barcode: Boolean(slip?.use_their_ref_barcode) && !slip?.use_our_ref_barcode,
        print_with_label: Boolean(slip?.print_with_label),
        slip_per_package: Boolean(slip?.slip_per_package)
    },
    packing_summary: normalizeSummary({
        summary_template: pickOption(summary?.summary_template, PACKING_SUMMARY_TEMPLATES, defaults.packing_summary.summary_template),
        summary_include_color_size: Boolean(summary?.summary_include_color_size),
        summary_include_bin: Boolean(summary?.summary_include_bin)
    }),
    sorting: {
        sort_by: pickOption(sorting?.sort_by, PACKING_DOCUMENTS_SORT_BY_OPTIONS, defaults.sorting.sort_by),
        sort_order: pickOption(sorting?.sort_order, PACKING_DOCUMENTS_SORT_ORDER_OPTIONS, defaults.sorting.sort_order)
    }
})
