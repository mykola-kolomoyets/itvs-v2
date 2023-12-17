import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateEmployeeForm } from '../types';
import { createEmployeeSchema } from '../schemas';

export const useCreateEmployeeForm = () => {
    const form = useForm<CreateEmployeeForm>({
        resolver: zodResolver(createEmployeeSchema),
        defaultValues: {
            name: undefined,
            email: undefined,
            image: undefined,
            url: '',
            academicStatus: 'assistant',
            disciplines: [],
        },
    });

    return form;
};
