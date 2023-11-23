import type { z } from 'zod';
import type { DialogProps } from '@radix-ui/react-dialog';
import type { WithClassName } from '@/types';
import type { createSubjectSchema } from './schemas';

export type CreateSubjectDialogProps = WithClassName<unknown> & DialogProps;

export type CreateSubjectForm = z.infer<typeof createSubjectSchema>;
