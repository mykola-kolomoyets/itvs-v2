import { z } from 'zod';
import { selectOptionSchema } from '@/schemas';

export const updateEmployeeSchema = z.object({
    name: z.string({ required_error: 'ПІБ обовʼязкові!' }).min(0, 'ПІБ обовʼязкові!'),
    email: z.string({ required_error: 'Пошта обовʼязкова!' }).email('Невірний формат пошти!'),
    image: z.string().optional(),
    url: z.string().optional(),
    academicStatus: z.string({ required_error: 'Вчене звання обовʼязкове!' }),
    disciplines: z.array(selectOptionSchema).optional(),
});
