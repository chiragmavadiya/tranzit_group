import { useState, useCallback } from 'react';
import { showToast } from '@/components/ui/custom-toast';

export const useCopyToClipboard = (successMessage = 'Copied to clipboard') => {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                showToast(successMessage, 'success');
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                showToast('Failed to copy to clipboard', 'error');
                console.error('Copy failed:', err);
            }
        },
        [successMessage]
    );

    return { copy, copied };
};
