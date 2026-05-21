import { FormSelect } from '@/features/orders/components/OrderFormUI';
import { useGlobalCouriers } from '../hooks/useGlobalCouriers';
import type { FormSelectProps } from '@/features/orders/components/types/OrderFormUI.types';

// interface GlobalCourierSelectProps {
//     value: string;
//     onValueChange: (value: string | null) => void;
//     error?: boolean;
//     errormsg?: string;
//     required?: boolean;
//     label?: string;
//     placeholder?: string;
//     className?: string;
// }

export function GlobalCourierSelect({
    label = "Courier Name",
    placeholder,
    ...rest
}: Omit<FormSelectProps, 'options'>) {
    const { data: options, isLoading } = useGlobalCouriers();

    return (
        <FormSelect
            label={label}
            options={options || []}
            placeholder={isLoading ? "Loading..." : (placeholder || "Select Courier")}
            {...rest}
        />
    );
}
