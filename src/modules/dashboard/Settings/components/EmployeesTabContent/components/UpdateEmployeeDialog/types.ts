import type { z } from 'zod';
import type { DialogProps } from '@radix-ui/react-dialog';
import type { WithClassName } from '@/types';
import type { updateEmployeeSchema } from './schemas';

export type UpdateEmployeeDialogProps = WithClassName<{
    employeeId?: string;
    onSuccess: () => void;
}> &
    DialogProps;

export type UpdateEmployeeForm = z.infer<typeof updateEmployeeSchema>;
