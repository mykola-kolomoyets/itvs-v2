import type { DialogProps } from '@radix-ui/react-alert-dialog';
import type { WithClassName } from '@/types';

export type RemoveArticleDialogProps = WithClassName<{
    id: string;
    onSuccess: () => void;
}> &
    DialogProps;
