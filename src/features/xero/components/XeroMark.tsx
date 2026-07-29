import { cn } from '@/lib/utils';

export const XeroMark = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 40 40" className={cn('shrink-0', className)} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#13B5EA" />
        <path
            d="M14.2 14.2l11.6 11.6M25.8 14.2L14.2 25.8"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
        />
    </svg>
);
