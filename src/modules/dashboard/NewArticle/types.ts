import type { MarkdownNodes } from '@/components/Markdown';

export type NewsItemConfig = {
    id: string;
    // index: number;
    nodeType: MarkdownNodes;
    content: string;
};
