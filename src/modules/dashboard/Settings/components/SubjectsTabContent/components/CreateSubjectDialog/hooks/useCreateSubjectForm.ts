import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateSubjectForm } from '../types';
import { createSubjectSchema } from '../schemas';

export const useCreateSubjectForm = () => {
    const form = useForm<CreateSubjectForm>({
        resolver: zodResolver(createSubjectSchema),
        defaultValues: {
            name: undefined,
            description: undefined,
            abbreviation: undefined,
            credits: undefined,
            code: undefined,
            departmentLecturers: [],
            otherLecturers: [],
            semesters: [],
        },
    });

    return form;
};
