import type { DialogProps } from '@radix-ui/react-alert-dialog';
import type { WithClassName } from '@/types';

export type ButchRemoveTagsDialogProps = WithClassName<{
    ids: string[];
    onSuccess: () => void;
}> &
    DialogProps;
