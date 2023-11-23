import type { z } from 'zod';
import type { DialogProps } from '@radix-ui/react-dialog';
import type { WithClassName } from '@/types';
import type { updateSubjectSchema } from './schemas';

export type UpdateSubjectDialogProps = WithClassName<{
    subjectId?: string;
    onSuccess: () => void;
}> &
    DialogProps;

export type UpdateSubjectForm = z.infer<typeof updateSubjectSchema>;
