import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UpdateEmployeeForm } from '../types';
import { updateEmployeeSchema } from '../schemas';

export const useUpdateEmployeeForm = () => {
    const form = useForm<UpdateEmployeeForm>({
        resolver: zodResolver(updateEmployeeSchema),
        defaultValues: {
            name: undefined,
            email: undefined,
            image: undefined,
            url: undefined,
            academicStatus: 'assistant',
            disciplines: [],
        },
    });

    return form;
};
