/* eslint-disable @next/next/no-img-element */
import { memo, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { CreateEmployeeDialogProps, CreateEmployeeForm } from './types';
// import type { Option } from '@/types';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useCreateEmployeeForm } from './hooks/useCreateEmployeeForm';
import { api } from '@/utils/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
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
import type { AcademicStatus } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
import { ScrollArea } from '@/components/ScrollArea';
import ImagePicker from '@/components/ImagePicker/ImagePicker';
// import { useDebouncedState } from '@/hooks/useDebouncedState';
// import { Case, Default, Switch } from '@/components/utils/Switch';
// import Link from 'next/link';

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({ open, onOpenChange, ...rest }) => {
    // const [disciplineSearchValue, debouncedDisciplineSearchValue, setDisciplineSearchValue] = useDebouncedState('');

    const form = useCreateEmployeeForm();
    const { control, handleSubmit, reset } = form;

    const utils = api.useUtils();

    // const {
    //     data: subjectsResponse,
    //     isLoading: isSubjectsLoading,
    //     isRefetching: isSubjectsRefetching,
    // } = api.subjects.getAllSubjects.useQuery(
    //     {
    //         search: debouncedDisciplineSearchValue.trim(),
    //     },
    //     {
    //         keepPreviousData: true,
    //     }
    // );
    const { mutateAsync: createEmployee, isLoading: isEmployeeCreating } = api.employees.createEmployee.useMutation({
        async onSuccess(createdEmployee) {
            await utils.employees.getAllEmployees.invalidate();

            onOpenChange?.(false);

            toast({
                title: 'Дисципліну успішно створено',
                description: (
                    <p>
                        Тег <strong>{createdEmployee.name}</strong> успішно створено. Тепер ви можете віднести викладача
                        до цієї дисципліни
                    </p>
                ),
            });
        },
    });

    const { toast } = useToast();

    // const subjectsOptions = useMemo(() => {
    //     return (
    //         subjectsResponse?.map((subject) => {
    //             return {
    //                 label: subject.name,
    //                 value: subject.id,
    //             };
    //         }) ?? []
    //     );
    // }, [subjectsResponse]);

    const createEmployeeHandler = useCallback(
        async ({ academicStatus, disciplines = [], ...rest }: CreateEmployeeForm) => {
            await createEmployee({
                ...rest,
                academicStatus: academicStatus as AcademicStatus,
                disciplines: disciplines.map((discipline) => {
                    return discipline.value;
                }),
            });
        },
        [createEmployee]
    );

    // const toggleDisciplineItemHandler = useCallback(
    //     (course: Option) => {
    //         return () => {
    //             const isIncluded =
    //                 form.getValues('disciplines')?.findIndex((item) => {
    //                     return item.value === course.value;
    //                 }) !== -1;

    //             if (isIncluded) {
    //                 form.setValue(
    //                     'disciplines',
    //                     form.getValues('disciplines')?.filter((item) => {
    //                         return item.value !== course.value;
    //                     })
    //                 );

    //                 return;
    //             }

    //             form.setValue('disciplines', [...(form.getValues('disciplines') ?? []), course]);
    //         };
    //     },
    //     [form]
    // );

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
            <DialogContent className="w-[90vw] max-w-[650px]">
                <Form {...form}>
                    <form onSubmit={handleSubmit(createEmployeeHandler)}>
                        <DialogHeader>
                            <DialogTitle>Додати співробітника</DialogTitle>
                            <DialogDescription>Заповніть всі поля, щоб додати нового співробітника</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="relative max-h-[750px] overflow-y-auto">
                            <div className="my-5 px-2">
                                <div className="flex w-full items-start">
                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="my-2 mr-2 flex w-3/5 flex-grow items-center">
                                                    <div className="w-full">
                                                        <FormLabel htmlFor="name">ПІБ</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                id="name"
                                                                placeholder="Введіть ПІБ"
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
                                        name="academicStatus"
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="my-2 mr-2 flex w-2/5 flex-grow items-center">
                                                    <div className="w-full">
                                                        <FormLabel htmlFor="courses">Науковий ступінь</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value ?? 'assistant'}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Виберіть науковий ступінь" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {Object.values(EMPLOYEE_ACADEMIC_STATUSES).map(
                                                                    (academicStatus) => {
                                                                        return (
                                                                            <SelectItem
                                                                                key={academicStatus.id}
                                                                                value={academicStatus.id}
                                                                            >
                                                                                {academicStatus.label}
                                                                            </SelectItem>
                                                                        );
                                                                    }
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </div>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 flex w-full items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="email">Пошта</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            id="email"
                                                            placeholder="Введіть пошту"
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
                                    name="image"
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
                                    name="url"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 flex w-full items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="email">Посилання на сторінку</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="url"
                                                            id="email"
                                                            placeholder="Введіть посилання на сторінку співробітника"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="mt-2" variant="secondary" disabled={isEmployeeCreating}>
                                    Відмінити
                                </Button>
                            </DialogClose>
                            <Button className="ml-2 mt-2" type="submit" variant="default" disabled={isEmployeeCreating}>
                                {isEmployeeCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Додати
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(CreateEmployeeDialog);
