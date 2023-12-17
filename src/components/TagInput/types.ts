import type { Option, WithClassName } from '@/types';

export type TagInputProps = WithClassName<{
    values: Option[];
    onItemChange: (id: string, newValue: string) => void;
    onItemRemove: (id: string) => void;
    onItemAdd: (id: string, value: string) => void;
}> &
    React.ComponentProps<'input'>;
