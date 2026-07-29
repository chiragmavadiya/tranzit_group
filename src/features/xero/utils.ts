import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDateTime = (value?: string | null) => {
    if (!value) return '';
    try {
        return format(parseISO(value), 'dd MMM yyyy, hh:mm a');
    } catch {
        return value;
    }
};

export const formatRelative = (value?: string | null) => {
    if (!value) return '';
    try {
        return formatDistanceToNow(parseISO(value), { addSuffix: true });
    } catch {
        return '';
    }
};
