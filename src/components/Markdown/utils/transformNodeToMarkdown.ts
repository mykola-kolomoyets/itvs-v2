import type { MarkdownNodes } from '../types';
import { MARKDOWN_NODES } from '../constants';

export const transformNodeToMarkdown = (type: MarkdownNodes, content: string) => {
    switch (type) {
        case MARKDOWN_NODES.HEADING_TWO:
            return `## ${content}\n\n`;
        case MARKDOWN_NODES.IMAGE: {
            return `![ІТВС](${content})\n\n`;
        }
        case MARKDOWN_NODES.PARAGRAPH:
        default:
            return `${content}\n\n`;
    }
};
