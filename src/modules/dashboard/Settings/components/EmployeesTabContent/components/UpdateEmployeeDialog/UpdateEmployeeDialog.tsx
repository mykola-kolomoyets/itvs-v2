import { memo, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { UpdateEmployeeDialogProps, UpdateEmployeeForm } from './types';
// import type { Option } from '@/types';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useUpdateEmployeeForm } from './hooks/useUpdateEmployeeForm';
import { api } from '@/utils/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/Dialog';
import type { AcademicStatus } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
import { ScrollArea } from '@/components/ScrollArea';
import ImagePicker from '@/components/ImagePicker';
// import { useDebouncedState } from '@/hooks/useDebouncedState';
// import { Case, Default, Switch } from '@/components/utils/Switch';
// import Link from 'next/link';

const UpdateEmployeeDialog: React.FC<UpdateEmployeeDialogProps> = ({
    open,
    employeeId,
    onSuccess,
    onOpenChange,
    ...rest
}) => {
    // const [disciplineSearchValue, debouncedDisciplineSearchValue, setDisciplineSearchValue] = useDebouncedState('');

    const form = useUpdateEmployeeForm();
    const { control, handleSubmit, reset } = form;

    const utils = api.useUtils();

    const { data: employeeData, isFetched } = api.employees.getEmployeesItem.useQuery({
        id: employeeId ?? '',
    });

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

    const { mutateAsync: updateEmployee, isLoading: isEmployeeUpdating } = api.employees.updateEmployee.useMutation({
        async onSuccess(updatedEmployee) {
            await utils.employees.getAllEmployees.invalidate();

            onSuccess?.();

            onOpenChange?.(false);

            toast({
                title: 'Дисципліну успішно створено',
                description: (
                    <p>
                        Тег <strong>{updatedEmployee.name}</strong> успішно створено. Тепер ви можете віднести викладача
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
        async ({ academicStatus, disciplines = [], ...rest }: UpdateEmployeeForm) => {
            await updateEmployee({
                id: employeeId!,
                ...rest,
                academicStatus: academicStatus as AcademicStatus,
                disciplines: disciplines.map((discipline) => {
                    return discipline.value;
                }),
            });
        },
        [updateEmployee, employeeId]
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
    }, [onSuccess, open, reset]);

    useEffect(() => {
        if (isFetched && employeeData) {
            form.setValue('name', employeeData.name);
            form.setValue('email', employeeData.email);
            form.setValue('url', employeeData?.url ?? '');
            form.setValue('image', employeeData?.image ?? '');
            form.setValue('academicStatus', employeeData.academicStatus ?? 'assistant');
            form.setValue(
                'disciplines',
                employeeData.disciplines.map((discipline) => {
                    return {
                        label: discipline.name,
                        value: discipline.id,
                    };
                })
            );
        }
    }, [employeeData, form, isFetched]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
            <DialogContent className="w-[90vw] max-w-[650px]">
                <Form {...form}>
                    <form onSubmit={handleSubmit(createEmployeeHandler)}>
                        <DialogHeader>
                            <DialogTitle>Оновити дані співробітника</DialogTitle>
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
                                                    <FormLabel htmlFor="credits">Зображення</FormLabel>
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
                                {/* <FormField
                                    control={control}
                                    name="disciplines"
                                    render={({ field }) => {
                                        const selectedCourses = (field.value ?? [])
                                            .map((item) => {
                                                return item.label;
                                            })
                                            .sort((a, b) => {
                                                return +a - +b;
                                            })
                                            .join(', ');

                                        return (
                                            <FormItem className="my-5 mr-2 flex w-full flex-grow items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="courses">Дисципліни</FormLabel>
                                                    <FormControl>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Input
                                                                    id="courses"
                                                                    placeholder="Виберіть дисципліни"
                                                                    contentEditable={false}
                                                                    value={
                                                                        !selectedCourses.trim()
                                                                            ? 'Виберіть дисципліни'
                                                                            : selectedCourses
                                                                    }
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent className=" w-80" align="start" side="top">
                                                                <Switch>
                                                                    <Case
                                                                        condition={
                                                                            isSubjectsLoading && !isSubjectsRefetching
                                                                        }
                                                                    >
                                                                        <div className="flex h-[200px] items-center justify-center">
                                                                            <Loader2 className="h-8 w-8 animate-spin" />
                                                                        </div>
                                                                    </Case>
                                                                    <Default>
                                                                        <div>
                                                                            <div className="mb-4">
                                                                                <Input
                                                                                    type="search"
                                                                                    placeholder='Наприклад: "Дизайн"'
                                                                                    value={disciplineSearchValue}
                                                                                    onChange={(event) => {
                                                                                        setDisciplineSearchValue(
                                                                                            event.target.value
                                                                                        );
                                                                                    }}
                                                                                    disabled={
                                                                                        !disciplineSearchValue.trim() &&
                                                                                        !subjectsResponse?.length
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <Switch>
                                                                                <Case condition={isSubjectsRefetching}>
                                                                                    <div className="flex h-[200px] items-center justify-center">
                                                                                        <Loader2 className="h-8 w-8 animate-spin" />
                                                                                    </div>
                                                                                </Case>
                                                                                <Case
                                                                                    condition={
                                                                                        !debouncedDisciplineSearchValue.trim() &&
                                                                                        !subjectsResponse?.length
                                                                                    }
                                                                                >
                                                                                    <div className="container my-16 flex w-full flex-col items-center">
                                                                                        <Image
                                                                                            className="w-full dark:rounded-2xl dark:bg-foreground dark:py-5"
                                                                                            src="/images/empty.png"
                                                                                            width={316}
                                                                                            height={202}
                                                                                            alt="Ще не було створено жодної дисципліни"
                                                                                        />
                                                                                        <h3 className="mt-3 text-center text-base">
                                                                                            Ще не було створено жодної
                                                                                            дисципліни, почніть з
                                                                                            додавання нової
                                                                                        </h3>
                                                                                        <Button
                                                                                            className="mt-2"
                                                                                            asChild
                                                                                        >
                                                                                            <Link href="/dashboard/settings?tab=subjects">
                                                                                                Додати дисципліну
                                                                                            </Link>
                                                                                        </Button>
                                                                                    </div>
                                                                                </Case>
                                                                                <Case
                                                                                    condition={
                                                                                        !!disciplineSearchValue.trim() &&
                                                                                        !subjectsResponse?.length
                                                                                    }
                                                                                >
                                                                                    <div className="container my-16 flex w-full flex-col items-center">
                                                                                        <Image
                                                                                            className="w-full dark:rounded-2xl dark:bg-foreground dark:py-5"
                                                                                            src="/images/empty.png"
                                                                                            width={316}
                                                                                            height={202}
                                                                                            alt="За вашим запитом нічого не знайдено"
                                                                                        />
                                                                                        <h3 className="mt-3 text-center text-base">
                                                                                            Нажаль, за вашим запитом
                                                                                            нічого не знайдено
                                                                                        </h3>
                                                                                    </div>
                                                                                </Case>
                                                                                <Default>
                                                                                    <ScrollArea className="max-h-[300px] overflow-y-auto">
                                                                                        {subjectsOptions.map(
                                                                                            (subject) => {
                                                                                                return (
                                                                                                    <Button
                                                                                                        key={
                                                                                                            subject.value
                                                                                                        }
                                                                                                        className="justify-between"
                                                                                                        variant="ghost"
                                                                                                        size="sm"
                                                                                                        onClick={toggleDisciplineItemHandler(
                                                                                                            subject
                                                                                                        )}
                                                                                                    >
                                                                                                        {subject.label}
                                                                                                        {field?.value?.findIndex(
                                                                                                            (item) => {
                                                                                                                return (
                                                                                                                    item.value ===
                                                                                                                    subject.value
                                                                                                                );
                                                                                                            }
                                                                                                        ) !== -1 ? (
                                                                                                            <CheckIcon
                                                                                                                size={
                                                                                                                    16
                                                                                                                }
                                                                                                            />
                                                                                                        ) : null}
                                                                                                    </Button>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                    </ScrollArea>
                                                                                </Default>
                                                                            </Switch>
                                                                        </div>
                                                                    </Default>
                                                                </Switch>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        );
                                    }}
                                /> */}
                            </div>
                        </ScrollArea>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="mt-2" variant="secondary" disabled={isEmployeeUpdating}>
                                    Відмінити
                                </Button>
                            </DialogClose>
                            <Button className="ml-2 mt-2" type="submit" variant="default" disabled={isEmployeeUpdating}>
                                {isEmployeeUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Оновити
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(UpdateEmployeeDialog);
