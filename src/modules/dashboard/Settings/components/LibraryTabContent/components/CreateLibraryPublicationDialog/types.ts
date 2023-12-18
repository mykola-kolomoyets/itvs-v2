import type { z } from 'zod';
import type { DialogProps } from '@radix-ui/react-dialog';
import type { WithClassName } from '@/types';
import type { createLibraryPublicationSchema } from './schemas';

export type CreateLibraryPublicationDialogProps = WithClassName<unknown> & DialogProps;

export type CreateLibraryPublicationForm = z.infer<typeof createLibraryPublicationSchema>;
