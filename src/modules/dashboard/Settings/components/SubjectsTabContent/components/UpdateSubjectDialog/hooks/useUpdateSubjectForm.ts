import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpdateSubjectForm } from '../types';
import { updateSubjectSchema } from '../schemas';

export const useUpdateSubjectForm = () => {
    const form = useForm<UpdateSubjectForm>({
        resolver: zodResolver(updateSubjectSchema),
        defaultValues: {
            name: undefined,
            description: undefined,
            abbreviation: undefined,
            credits: undefined,
            semesters: [],
        },
    });

    return form;
};
