import type { LucideIcon } from 'lucide-react';
import type { WithClassName } from '@/types';

export type AboutCardItem = {
    title: string;
    description: string;
    Icon: LucideIcon;
};

export type AboutCardProps = WithClassName<AboutCardItem>;
