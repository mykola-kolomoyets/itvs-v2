import type { z } from 'zod';
import type { DialogProps } from '@radix-ui/react-dialog';
import type { WithClassName } from '@/types';
import type { createEmployeeSchema } from './schemas';

export type CreateEmployeeDialogProps = WithClassName<unknown> & DialogProps;

export type CreateEmployeeForm = z.infer<typeof createEmployeeSchema>;
