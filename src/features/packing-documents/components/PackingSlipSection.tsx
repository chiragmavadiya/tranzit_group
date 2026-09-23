import { FileText } from 'lucide-react'
import { RadioGroup } from '@/components/ui/radio-group'
import { FormCheckbox } from '@/features/orders/components/OrderFormUI'
import { PACKING_SLIP_TEMPLATES } from '../constants/packing-documents.constants'
import type { PackingSlipSettings, PackingSlipTemplate } from '../types/packing-documents.types'
import { TemplateCard } from './TemplateCard'
import { SettingsSectionCard } from './SettingsSectionCard'

const SubHeading = ({ title, description }: { title: string; description: string }) => (
    <div>
        <h3 className="my-0 text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
            {title}
        </h3>
        <p className="my-0 text-[12px] text-gray-400 dark:text-zinc-500">{description}</p>
    </div>
)

const OPTION_GROUP_CLASS = 'grid gap-2 rounded-md border border-gray-200 dark:border-zinc-800 p-1 lg:grid-cols-2'

interface PackingSlipSectionProps {
    settings: PackingSlipSettings
    disabled: boolean
    isPreviewLoading: boolean
    isDirty: boolean
    isSaving: boolean
    onChange: (patch: Partial<PackingSlipSettings>) => void
    onPreview: () => void
    onSave: () => void
    onReset: () => void
}

export function PackingSlipSection({
    settings,
    disabled,
    isPreviewLoading,
    isDirty,
    isSaving,
    onChange,
    onPreview,
    onSave,
    onReset
}: PackingSlipSectionProps) {
    const selectTemplate = (value: string) => onChange({ template: value as PackingSlipTemplate })

    return (
        <SettingsSectionCard
            icon={FileText}
            title="Packing Slip"
            description="Choose the size of the packing slip and what gets printed on it."
            disabled={disabled}
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={onSave}
            onReset={onReset}
            onPreview={onPreview}
            isPreviewLoading={isPreviewLoading}
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <SubHeading title="Template size" description="Applies to every packing slip you print." />
                    <RadioGroup
                        value={settings.template}
                        onValueChange={selectTemplate}
                        disabled={disabled}
                        className="grid gap-3 sm:grid-cols-2"
                    >
                        {PACKING_SLIP_TEMPLATES.map((template) => (
                            <TemplateCard
                                key={template.value}
                                value={template.value}
                                label={template.label}
                                description={template.description}
                                selected={settings.template === template.value}
                                disabled={disabled}
                                onSelect={selectTemplate}
                            />
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <SubHeading title="Advanced options" description="Control the barcodes printed on the slip." />
                    <div className={OPTION_GROUP_CLASS}>
                        <FormCheckbox
                            label="Display order item barcode"
                            description="Prints a scannable barcode next to each item on the slip."
                            checked={settings.display_item_barcode}
                            disabled={disabled}
                            onCheckedChange={(checked) => onChange({ display_item_barcode: checked })}
                        />
                        <FormCheckbox
                            label="Rotate item barcode"
                            description="Prints the barcode sideways so longer codes fit the column."
                            checked={settings.rotate_packing_slip}
                            disabled={disabled}
                            onCheckedChange={(checked) => onChange({ rotate_packing_slip: checked })}
                        />
                        <FormCheckbox
                            label="Use our reference as the order number barcode"
                            description="Encodes the Tranzit order number in the order barcode."
                            info="Only one reference can be encoded in the order number barcode."
                            checked={settings.use_our_ref_barcode}
                            disabled={disabled}
                            onCheckedChange={(checked) => onChange({ use_our_ref_barcode: checked })}
                        />
                        <FormCheckbox
                            label="Use customer reference as the order number barcode"
                            description="Encodes your own customer reference in the order barcode instead."
                            info="Only one reference can be encoded in the order number barcode."
                            checked={settings.use_their_ref_barcode}
                            disabled={disabled}
                            onCheckedChange={(checked) => onChange({ use_their_ref_barcode: checked })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <SubHeading title="Printing behaviour" description="Decide when a packing slip is produced." />
                    <div className={OPTION_GROUP_CLASS}>
                        <FormCheckbox
                            label="Print packing slip with each label"
                            description="Every time a shipping label is printed, its packing slip prints with it."
                            checked={settings.print_with_label}
                            disabled={disabled}
                            onCheckedChange={(checked) => onChange({ print_with_label: checked })}
                        />
                        <FormCheckbox
                            label="Print a separate packing slip for each package"
                            description="An order with three packages produces three slips instead of one."
                            checked={settings.slip_per_package}
                            disabled={disabled}
                            onCheckedChange={(checked) => onChange({ slip_per_package: checked })}
                        />
                    </div>
                </div>
            </div>
        </SettingsSectionCard>
    )
}
