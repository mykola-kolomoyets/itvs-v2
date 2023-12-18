import { useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { CreateLibraryPublicationDialogProps, CreateLibraryPublicationForm } from './types';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useCreateLibraryPublicationForm } from './hooks/useCreateLibraryPublicationForm';
import { api } from '@/utils/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { ScrollArea } from '@/components/ScrollArea';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog';
import TagInput from '@/components/TagInput';
import { Label } from '@/components/Label';
import ImagePicker from '@/components/ImagePicker';

const CreateLibraryPublicationDialog: React.FC<CreateLibraryPublicationDialogProps> = ({
    open,
    onOpenChange,
    ...rest
}) => {
    const form = useCreateLibraryPublicationForm();
    const { control, handleSubmit, reset } = form;

    const utils = api.useUtils();

    const { mutateAsync: createLibraryPublication, isLoading: isSubjectCreating } =
        api.libraryPublication.createLibraryPublication.useMutation({
            async onSuccess(createdPublication) {
                await utils.libraryPublication.getAllLibraryPublications.invalidate();

                onOpenChange?.(false);

                toast({
                    title: 'Публікацію успішно створено',
                    description: (
                        <p>
                            Публікацію <strong>{createdPublication.title}</strong> успішно створено.
                        </p>
                    ),
                });
            },
        });

    const { toast } = useToast();

    const createPublicationHandler = useCallback(
        async ({ authors, ...rest }: CreateLibraryPublicationForm) => {
            await createLibraryPublication({
                ...rest,
                authors: authors.map((author) => {
                    return author.label;
                }),
            });
        },
        [createLibraryPublication]
    );

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
            <DialogContent className="w-[90vw] max-w-[650px] px-0">
                <Form {...form}>
                    <form onSubmit={handleSubmit(createPublicationHandler)}>
                        <DialogHeader className="px-5">
                            <DialogTitle>Створити нову дисципліну</DialogTitle>
                            <DialogDescription>
                                Створіть нову дисципліну, щоб віднести виклачача(ів) до певної дисципліни
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className=" my-2 max-h-[60vh] overflow-y-auto">
                            <div className="my-5 px-5">
                                <FormField
                                    control={control}
                                    name="title"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 flex flex-grow items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="name">Назва публікації</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="name"
                                                            placeholder="Введіть назву публікації"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={control}
                                    name="publicator"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 flex flex-grow items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="name">Видавець</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="name"
                                                            placeholder="Введіть видавця"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={control}
                                    name="posterUrl"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-5 mr-2 flex w-full flex-grow items-center">
                                                <div className="w-full">
                                                    <FormControl>
                                                        <ImagePicker
                                                            url={field.value ?? ''}
                                                            onUrlChange={field.onChange}
                                                            errorMessage={<FormMessage />}
                                                        />
                                                    </FormControl>
                                                </div>
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={control}
                                    name="authors"
                                    render={({ field }) => {
                                        return (
                                            <>
                                                <Label htmlFor="authors">Автори</Label>
                                                <TagInput
                                                    id="authors"
                                                    values={field.value}
                                                    onItemAdd={(id, value) => {
                                                        if (
                                                            field.value.findIndex((item) => {
                                                                return item.label === value;
                                                            }) !== -1
                                                        ) {
                                                            return;
                                                        }

                                                        field.onChange([...field.value, { label: value, value: id }]);
                                                    }}
                                                    onItemRemove={(id) => {
                                                        field.onChange(
                                                            field.value.filter((item) => {
                                                                return item.value !== id;
                                                            })
                                                        );
                                                    }}
                                                    onItemChange={(id, value) => {
                                                        field.onChange(
                                                            field.value.map((item) => {
                                                                if (item.value === id) {
                                                                    return { ...item, label: value };
                                                                }
                                                                return item;
                                                            })
                                                        );
                                                    }}
                                                />
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter className="px-5">
                            <DialogClose asChild>
                                <Button className="mt-2" variant="secondary" disabled={isSubjectCreating}>
                                    Відмінити
                                </Button>
                            </DialogClose>
                            <Button className="ml-2 mt-2" type="submit" variant="default" disabled={isSubjectCreating}>
                                {isSubjectCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Створити
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateLibraryPublicationDialog;
