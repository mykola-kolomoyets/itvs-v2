import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateLibraryPublicationForm } from '../types';
import { createLibraryPublicationSchema } from '../schemas';

export const useCreateLibraryPublicationForm = () => {
    const form = useForm<CreateLibraryPublicationForm>({
        resolver: zodResolver(createLibraryPublicationSchema),
        defaultValues: {
            title: undefined,
            authors: [],
            createdAt: new Date(),
            posterUrl: undefined,
            publicator: undefined,
        },
    });

    return form;
};
