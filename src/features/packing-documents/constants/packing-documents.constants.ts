import type {
    PackingDocumentsConfiguration,
    PackingDocumentsSortBy,
    PackingDocumentsSortOrder,
    PackingSlipTemplate,
    PackingSummaryTemplate
} from '../types/packing-documents.types'

export const DEFAULT_PACKING_DOCUMENTS_CONFIGURATION: PackingDocumentsConfiguration = {
    packing_slip: {
        template: 'a4',
        display_item_barcode: false,
        rotate_packing_slip: false,
        use_our_ref_barcode: false,
        use_their_ref_barcode: false,
        print_with_label: false,
        slip_per_package: false
    },
    packing_summary: {
        summary_template: 'items',
        summary_include_color_size: false,
        summary_include_bin: false
    },
    sorting: {
        sort_by: 'sku',
        sort_order: 'asc'
    }
}

type SelectableOption<T extends string> = {
    value: T
    label: string
    description: string
}

export const PACKING_SLIP_TEMPLATES: SelectableOption<PackingSlipTemplate>[] = [
    {
        value: 'a4',
        label: 'A4',
        description: 'Standard packing slip with one order per page.'
    },
    {
        value: 'label',
        label: '100 × 150 mm',
        description: 'Compact format suitable for a thermal printer.'
    }
]

// Mirrors the `summary_template_options` the summary endpoint returns.
export const PACKING_SUMMARY_TEMPLATES: SelectableOption<PackingSummaryTemplate>[] = [
    {
        value: 'items',
        label: 'Items Summary',
        description: 'A4 summary of SKUs, item descriptions and quantity contained within selected orders.'
    },
    {
        value: 'orders',
        label: 'Order Summary',
        description: 'A4 summary of orders, including order number, order barcode, SKUs, item descriptions and quantity.'
    },
    {
        value: 'orders_item_barcodes',
        label: 'Order Summary with Item Barcodes',
        description: 'A4 summary of orders, including order number and barcode, SKUs, SKU barcodes and quantity.'
    }
]

// Mirrors the `sort_by_options` / `sort_order_options` the sorting endpoint returns.
export const PACKING_DOCUMENTS_SORT_BY_OPTIONS: { value: PackingDocumentsSortBy; label: string }[] = [
    { value: 'sku', label: 'Item SKU' },
    { value: 'name', label: 'Item Name' },
    { value: 'quantity', label: 'Quantity' }
]

export const PACKING_DOCUMENTS_SORT_ORDER_OPTIONS: { value: PackingDocumentsSortOrder; label: string }[] = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
]
