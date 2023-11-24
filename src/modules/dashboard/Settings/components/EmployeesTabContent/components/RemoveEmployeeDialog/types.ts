import type { DialogProps } from '@radix-ui/react-alert-dialog';
import type { WithClassName } from '@/types';

export type RemoveEmployeeDialogProps = WithClassName<{
    employeeId: string;
    onSuccess: () => void;
}> &
    DialogProps;
