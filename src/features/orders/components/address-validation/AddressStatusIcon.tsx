import { Check, AlertTriangle } from 'lucide-react';
import { CustomTooltip } from '@/components/common/CustomTooltip';

export type AddressStatus = 'valid' | 'invalid' | 'skipped' | 'unchecked';

export const AddressStatusIcon = ({
    status,
    message,
}: {
    status?: AddressStatus | string | null;
    message?: string | null;
}) => {
    if (status === 'valid') {
        return (
            <CustomTooltip title={message || 'Address is valid'}>
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
            </CustomTooltip>
        );
    }

    if (status === 'invalid') {
        return (
            <CustomTooltip title={message || 'Address needs attention'}>
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                    <AlertTriangle className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
            </CustomTooltip>
        );
    }

    return null;
};

export const AddressStatusBadge = ({
    status,
    message,
}: {
    status?: AddressStatus | string | null;
    message?: string | null;
}) => {
    if (status !== 'valid' && status !== 'invalid') {
        return <span className="text-slate-400 dark:text-zinc-500">-</span>;
    }

    const valid = status === 'valid';

    return (
        <CustomTooltip title={message || (valid ? 'Address is valid' : 'Address needs attention')}>
            <span
                className={`inline-flex items-center gap-1.5 font-medium ${valid
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                    }`}
            >
                <span
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white ${valid ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                >
                    {valid
                        ? <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        : <AlertTriangle className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>
                {valid ? 'Valid' : 'Invalid'}
            </span>
        </CustomTooltip>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const dash = (value?: string | null) => {
    const trimmed = (value ?? '').trim();
    return trimmed === '' ? '-' : trimmed;
};
