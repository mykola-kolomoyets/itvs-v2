import type { VariantProps } from 'class-variance-authority';
import type { BUTTON_VARIANTS } from './constants';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof BUTTON_VARIANTS> & {
        asChild?: boolean;
    };
