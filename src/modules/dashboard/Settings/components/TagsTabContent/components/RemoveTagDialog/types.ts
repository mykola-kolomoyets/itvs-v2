import type { DialogProps } from '@radix-ui/react-alert-dialog';
import type { WithClassName } from '@/types';

export type RemoveTagDialogProps = WithClassName<{
    id: string;
    onSuccess: () => void;
}> &
    DialogProps;
