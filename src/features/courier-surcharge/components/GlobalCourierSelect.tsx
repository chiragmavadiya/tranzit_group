import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { useGlobalCouriers } from '../hooks/useGlobalCouriers';

interface GlobalCourierSelectProps {
    value: string;
    onValueChange: (value: string | null) => void;
    error?: boolean;
    errormsg?: string;
    required?: boolean;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function GlobalCourierSelect({
    value,
    onValueChange,
    error,
    errormsg,
    required,
    label = "Courier Name",
    placeholder,
    className
}: GlobalCourierSelectProps) {
    const { data: options, isLoading } = useGlobalCouriers();

    return (
        <FormSelect
            label={label}
            value={value}
            onValueChange={onValueChange}
            options={options || []}
            placeholder={isLoading ? "Loading..." : (placeholder || "Select Courier")}
            required={required}
            error={error}
            errormsg={errormsg}
            className={className}
        />
    );
}
