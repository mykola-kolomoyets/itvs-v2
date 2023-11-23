import type { DialogProps } from '@radix-ui/react-alert-dialog';
import type { WithClassName } from '@/types';

export type RemoveSubjectDialogProps = WithClassName<{
    id: string;
    onSuccess: () => void;
}> &
    DialogProps;
