import { memo, useCallback, useEffect, useMemo } from 'react';
import { CheckIcon, Loader2, TrashIcon } from 'lucide-react';
import type { CreateEmployeeDialogProps, CreateEmployeeForm } from './types';
import type { Option } from '@/types';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useCreateEmployeeForm } from './hooks/useCreateEmployeeForm';
import { api } from '@/utils/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
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
import { IMAGES_ALLOWED_DOMAINS } from '@/modules/dashboard/NewArticle/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
import { ScrollArea } from '@/components/ScrollArea';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/common';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { Case, Default, Switch } from '@/components/utils/Switch';
import Link from 'next/link';

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({ open, onOpenChange, ...rest }) => {
    const [disciplineSearchValue, debouncedDisciplineSearchValue, setDisciplineSearchValue] = useDebouncedState('');

    const form = useCreateEmployeeForm();
    const { control, handleSubmit, reset } = form;

    const utils = api.useUtils();

    const {
        data: subjectsResponse,
        isLoading: isSubjectsLoading,
        isRefetching: isSubjectsRefetching,
    } = api.subjects.getAllSubjects.useQuery(
        {
            search: debouncedDisciplineSearchValue.trim(),
        },
        {
            keepPreviousData: true,
        }
    );
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

    const subjectsOptions = useMemo(() => {
        return (
            subjectsResponse?.map((subject) => {
                return {
                    label: subject.name,
                    value: subject.id,
                };
            }) ?? []
        );
    }, [subjectsResponse]);

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

    const toggleDisciplineItemHandler = useCallback(
        (course: Option) => {
            return () => {
                const isIncluded =
                    form.getValues('disciplines')?.findIndex((item) => {
                        return item.value === course.value;
                    }) !== -1;

                if (isIncluded) {
                    form.setValue(
                        'disciplines',
                        form.getValues('disciplines')?.filter((item) => {
                            return item.value !== course.value;
                        })
                    );

                    return;
                }

                form.setValue('disciplines', [...(form.getValues('disciplines') ?? []), course]);
            };
        },
        [form]
    );

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
                                                    <FormLabel htmlFor="credits">Зображення</FormLabel>
                                                    <FormControl>
                                                        <>
                                                            <Input
                                                                type="url"
                                                                id="title"
                                                                placeholder="Вставте посилання на зображення"
                                                                value={field.value}
                                                                onChange={(event) => {
                                                                    if (!event.target.value.length) {
                                                                        field.onChange('');
                                                                        return;
                                                                    }

                                                                    if (
                                                                        IMAGES_ALLOWED_DOMAINS.some((domain) => {
                                                                            return event.target.value.includes(domain);
                                                                        })
                                                                    ) {
                                                                        const newValue = event.target.value
                                                                            .replace('file/d/', 'uc?export=view&id=')
                                                                            .replace('/view?usp=sharing', '');

                                                                        field.onChange(newValue);
                                                                    } else {
                                                                        setTimeout(() => {
                                                                            toast({
                                                                                variant: 'destructive',
                                                                                title: 'Некоректне посилання на зображення',
                                                                                description: (
                                                                                    <div className="flex flex-wrap">
                                                                                        <span>
                                                                                            Дозволені посилання:
                                                                                        </span>
                                                                                        <ul className=" mt-2">
                                                                                            {IMAGES_ALLOWED_DOMAINS.map(
                                                                                                (domain) => {
                                                                                                    return (
                                                                                                        <li
                                                                                                            key={domain}
                                                                                                        >
                                                                                                            <strong>
                                                                                                                {domain}
                                                                                                            </strong>
                                                                                                        </li>
                                                                                                    );
                                                                                                }
                                                                                            )}
                                                                                        </ul>
                                                                                    </div>
                                                                                ),
                                                                            });
                                                                        }, 0);
                                                                    }
                                                                }}
                                                            />
                                                            <span className="text-xs">
                                                                Підтримуються зображення з наступних ресурсів:{' '}
                                                                <strong>Google&nbsp;Docs</strong>,{' '}
                                                                <strong>Unspash</strong>, <strong>Pexels</strong>,{' '}
                                                                <strong>lpnu.ua</strong>
                                                            </span>
                                                        </>
                                                    </FormControl>
                                                    <FormMessage />
                                                    <div className="w-full max-w-[750px]">
                                                        {field.value ? (
                                                            <>
                                                                <div className="relative mt-2 flex justify-center">
                                                                    <Button
                                                                        className="absolute right-4 top-4"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            field.onChange('');
                                                                        }}
                                                                    >
                                                                        <TrashIcon size={16} />
                                                                    </Button>
                                                                    <Image
                                                                        className="max-h-[550px] w-full rounded-lg object-cover object-center"
                                                                        src={field.value}
                                                                        width={720}
                                                                        height={720}
                                                                        alt="Зображення співробітника"
                                                                        title="Зображення співробітника"
                                                                        placeholder="blur"
                                                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                                                            shimmer(720, 720)
                                                                        )}`}
                                                                        onError={() => {
                                                                            field.onChange('');
                                                                        }}
                                                                    />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <p className="mt-3 text-base">
                                                                Зображення не вставлено, або посилання некоректне
                                                            </p>
                                                        )}
                                                    </div>
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
                                <FormField
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
