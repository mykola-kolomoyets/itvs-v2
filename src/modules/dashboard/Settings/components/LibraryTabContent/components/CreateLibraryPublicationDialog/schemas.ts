import { selectOptionSchema } from '@/schemas';
import { z } from 'zod';

export const createLibraryPublicationSchema = z.object({
    title: z.string({ required_error: 'Назва обовʼязкова!' }).min(1, 'Назва обовʼязкова!'),
    createdAt: z.date(),
    posterUrl: z.string({ required_error: 'Фотографія обкладинки обовʼязкова!' }),
    authors: z.array(selectOptionSchema).min(1, 'Автори обовʼязкові!'),
    publicator: z.string({ required_error: 'Видавництво обовʼязкове!' }),
});
