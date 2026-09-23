import { ClipboardList } from 'lucide-react'
import { RadioGroup } from '@/components/ui/radio-group'
import { FormCheckbox } from '@/features/orders/components/OrderFormUI'
import { PACKING_SUMMARY_TEMPLATES } from '../constants/packing-documents.constants'
import type { PackingSummaryOptions, PackingSummaryTemplate } from '../types/packing-documents.types'
import { TemplateCard } from './TemplateCard'
import { SettingsSectionCard } from './SettingsSectionCard'

interface PackingSummarySectionProps {
    settings: PackingSummaryOptions
    disabled: boolean
    isDirty: boolean
    isSaving: boolean
    isPreviewLoading: boolean
    onChange: (patch: Partial<PackingSummaryOptions>) => void
    onPreview: () => void
    onSave: () => void
    onReset: () => void
}

export function PackingSummarySection({
    settings,
    disabled,
    isDirty,
    isSaving,
    isPreviewLoading,
    onChange,
    onPreview,
    onSave,
    onReset
}: PackingSummarySectionProps) {
    const selectTemplate = (value: string) => onChange({ summary_template: value as PackingSummaryTemplate })

    return (
        <SettingsSectionCard
            icon={ClipboardList}
            title="Packing Summary"
            description="Pick how items are grouped when you print a summary for a batch of orders."
            disabled={disabled}
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={onSave}
            onReset={onReset}
            onPreview={onPreview}
            isPreviewLoading={isPreviewLoading}
        >
            <RadioGroup
                value={settings.summary_template}
                onValueChange={selectTemplate}
                disabled={disabled}
                className="grid items-start gap-3 lg:grid-cols-3"
            >
                {PACKING_SUMMARY_TEMPLATES.map((template) => (
                    <TemplateCard
                        key={template.value}
                        value={template.value}
                        label={template.label}
                        description={template.description}
                        selected={settings.summary_template === template.value}
                        disabled={disabled}
                        onSelect={selectTemplate}
                    >
                        {/* Only the items summary carries these, per the API's
                            `summary_template_options[].options`. */}
                        {template.value === 'items' && settings.summary_template === 'items' && (
                            <div className="grid gap-0.5">
                                <FormCheckbox
                                    label="Include Color and Size"
                                    checked={settings.summary_include_color_size}
                                    disabled={disabled}
                                    className="gap-3 p-2"
                                    onCheckedChange={(checked) => onChange({ summary_include_color_size: checked })}
                                />
                                <FormCheckbox
                                    label="Include Bin Location"
                                    checked={settings.summary_include_bin}
                                    disabled={disabled}
                                    className="gap-3 p-2"
                                    onCheckedChange={(checked) => onChange({ summary_include_bin: checked })}
                                />
                            </div>
                        )}
                    </TemplateCard>
                ))}
            </RadioGroup>
        </SettingsSectionCard>
    )
}
