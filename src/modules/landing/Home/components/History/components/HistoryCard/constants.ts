import type { Variants } from 'framer-motion';

export const HISTORY_CARD_VARIANTS: Variants = {
    offscreen: {
        y: 100,
        opacity: 0.1,
    },
    onscreen: {
        y: 20,
        opacity: 1,
        transition: {
            type: 'spring',
            // bounce: 0.5,
            duration: 1,
        },
    },
};
