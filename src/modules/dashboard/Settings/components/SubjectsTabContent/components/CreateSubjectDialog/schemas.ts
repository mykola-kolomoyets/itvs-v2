import { z } from 'zod';
import { selectOptionSchema } from '@/schemas';

export const createSubjectSchema = z.object({
    name: z.string({ required_error: 'Назва дисципліни обовʼязкова!' }).min(3, 'Назва дисципліни обовʼязкова!'),
    abbreviation: z.string({ required_error: 'Абревіатура обовʼязкова!' }),
    code: z.string().optional(),
    description: z.string({ required_error: 'Опис обовʼязковий!' }),
    credits: z.number({ required_error: 'Кредити обовʼязкові!' }).min(0.1, { message: 'Мінімальний кредит - 0.1!' }),
    semesters: z.array(selectOptionSchema).min(1, { message: 'Потрібно вибрати хоча б один семестр' }),
    departmentLecturers: z.array(selectOptionSchema).optional(),
    otherLecturers: z.array(z.string()),
});
