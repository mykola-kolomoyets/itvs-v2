import type { WithClassName } from '@/types';

export type HistoryItem = {
    title: string;
    description: string;
    subItems?: HistoryItem[];
};

export type HistoryCardProps = WithClassName<HistoryItem> & {
    index: number;
    level?: number;
    isSticky?: boolean;
};
