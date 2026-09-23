export type PackingSlipTemplate = 'a4' | 'label'

export type PackingSummaryTemplate = 'items' | 'orders' | 'orders_item_barcodes'

export type PackingDocumentsSortBy = 'sku' | 'name' | 'quantity'

export type PackingDocumentsSortOrder = 'asc' | 'desc'

export type PackingSlipSettings = {
    template: PackingSlipTemplate
    display_item_barcode: boolean
    rotate_packing_slip: boolean
    use_our_ref_barcode: boolean
    use_their_ref_barcode: boolean
    print_with_label: boolean
    slip_per_package: boolean
}

export type PackingSummaryOptions = {
    summary_template: PackingSummaryTemplate
    summary_include_color_size: boolean
    summary_include_bin: boolean
}

export type PackingDocumentsSorting = {
    sort_by: PackingDocumentsSortBy
    sort_order: PackingDocumentsSortOrder
}

export type PackingDocumentsConfiguration = {
    packing_slip: PackingSlipSettings
    packing_summary: PackingSummaryOptions
    sorting: PackingDocumentsSorting
}
