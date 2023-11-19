import { MARKDOWN_NODES } from '@/components/Markdown/constants';

export const NODES_INITIAL_CONTENT = {
    [MARKDOWN_NODES.HEADING_TWO]: 'Заголовок',
    [MARKDOWN_NODES.PARAGRAPH]: 'Абзац',
    [MARKDOWN_NODES.IMAGE]: '',
};

export const IMAGES_ALLOWED_DOMAINS = [
    'https://lh3.googleusercontent.com',
    'drive.google.com',
    'images.unsplash.com',
    'images.pexels.com',
    'lpnu.ua',
];
