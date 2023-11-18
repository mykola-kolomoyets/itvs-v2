import type { DialogProps } from '@radix-ui/react-dialog';
import type { WithClassName } from '@/types';

export type UpdateTagDialogProps = WithClassName<{
    id: string;
    onSuccess: () => void;
}> &
    DialogProps;
