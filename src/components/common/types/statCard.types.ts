import type { LucideIcon } from 'lucide-react';

export interface StatItem {
    label: string;
    value: string | number;
    icon: LucideIcon;
    subValue?: string;
    color?: string;
    className?: string;
    iconBg?: string;
    iconColor?: string;
}