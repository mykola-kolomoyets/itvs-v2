import { memo, useCallback, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { CheckIcon, DeleteIcon, Loader2 } from 'lucide-react';
import type { Option } from '@/types';
import type { UpdateSubjectDialogProps, UpdateSubjectForm } from './types';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useToggle } from '@/hooks/useToggle';
import { useUpdateSubjectForm } from './hooks/useUpdateSubjectForm';
import { api } from '@/utils/api';
import { DISCIPLINE_SEMESTERS_OPTIONS } from '@/constants';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { ScrollArea } from '@/components/ScrollArea';
import { Textarea } from '@/components/TextArea';
import Markdown from '@/components/Markdown';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { Case, Switch } from '@/components/utils/Switch';
import type { Employee } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { getFirstLetters } from '@/utils/common';
import { Label } from '@/components/Label';
import TagInput from '@/components/TagInput';

const UpdateSubjectDialog: React.FC<UpdateSubjectDialogProps> = ({
    open,
    subjectId,
    onSuccess,
    onOpenChange,
    ...rest
}) => {
    const form = useUpdateSubjectForm();
    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = form;

    const [employeesSearch, debounceEmployeesSearch, setEmployeesSearch] = useDebouncedState('');
    const [isMarkdownPreview, toggleIsMarkdownPreview] = useToggle();

    const utils = api.useUtils();

    const { data: employees } = api.employees.getAllEmployees.useQuery({
        search: debounceEmployeesSearch,
    });

    const { data: subjectToEditData } = api.subjects.getSubjectItem.useQuery(
        {
            id: subjectId!,
        },
        {
            enabled: !!subjectId,
            // NOTE: deprecated
            onSuccess(data) {
                if (data) {
                    form.setValue('name', data.name);
                    form.setValue('abbreviation', data.abbreviation ?? '');
                    form.setValue('description', data.description);
                    form.setValue('credits', data.credits);
                    form.setValue(
                        'semesters',
                        Object.values(DISCIPLINE_SEMESTERS_OPTIONS)
                            .flat()
                            .filter((semester) => {
                                return data.semesters.split(',').includes(semester.value);
                            })
                    );
                    form.setValue(
                        'departmentLecturers',
                        data.departmentLecturers.map((lecturer) => {
                            return {
                                label: lecturer.name,
                                value: lecturer.id,
                            };
                        })
                    );
                    form.setValue(
                        'otherLecturers',
                        data.otherLecturers.split(',').map((item, index) => {
                            return {
                                label: item,
                                value: index.toString(),
                            };
                        })
                    );
                }
            },
        }
    );

    const { mutateAsync: updateSubject, isLoading: isSubjectUpdating } = api.subjects.updateSubject.useMutation({
        async onSuccess(updatedSubject) {
            await utils.subjects.getAllSubjects.invalidate();

            onSuccess?.();

            onOpenChange?.(false);

            toast({
                title: 'Дисципліну успішно оновлено',
                description: (
                    <p>
                        Тег <strong>{updatedSubject.name}</strong> успішно оновлено.
                    </p>
                ),
            });
        },
    });

    const { toast } = useToast();

    const createSubjectHandler = useCallback(
        async ({ otherLecturers, ...rest }: UpdateSubjectForm) => {
            await updateSubject({
                id: subjectId!,
                ...rest,
                otherLecturers: otherLecturers.map((lecturer) => {
                    return lecturer.label;
                }),
            });
        },
        [subjectId, updateSubject]
    );

    const toggleSemesterItemHandler = useCallback(
        (course: Option) => {
            return () => {
                const isIncluded =
                    form.getValues('semesters').findIndex((item) => {
                        return item.value === course.value;
                    }) !== -1;

                if (isIncluded) {
                    form.setValue(
                        'semesters',
                        form.getValues('semesters').filter((item) => {
                            return item.value !== course.value;
                        })
                    );

                    return;
                }

                form.setValue('semesters', [...form.getValues('semesters'), course]);
            };
        },
        [form]
    );

    const toggleEmployeeItemHandler = useCallback(
        (employee: Employee) => {
            const isIncluded =
                form.getValues('departmentLecturers').findIndex((item) => {
                    return item.value === employee.id;
                }) !== -1;

            if (isIncluded) {
                form.setValue(
                    'departmentLecturers',
                    form.getValues('departmentLecturers').filter((item) => {
                        return item.value !== employee.id;
                    })
                );
                return;
            }
            form.setValue('departmentLecturers', [
                ...form.getValues('departmentLecturers'),
                {
                    label: employee.name,
                    value: employee.id,
                },
            ]);
        },
        [form]
    );

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    useEffect(() => {
        if (subjectToEditData) {
            const subjectCourses = subjectToEditData.semesters.split(',');

            form.setValue('name', subjectToEditData.name);
            form.setValue('abbreviation', subjectToEditData.abbreviation ?? '');
            form.setValue('description', subjectToEditData.description);
            form.setValue('credits', subjectToEditData.credits);
            form.setValue(
                'semesters',
                Object.values(DISCIPLINE_SEMESTERS_OPTIONS)
                    .flat()
                    .filter((course) => {
                        return subjectCourses.includes(course.value);
                    })
            );
        }
    }, [form, isDirty, subjectToEditData]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
            <DialogContent className="w-[90vw] max-w-[650px]">
                <Form {...form}>
                    <form onSubmit={handleSubmit(createSubjectHandler)}>
                        <DialogHeader>
                            <DialogTitle>Оновити дисципліну</DialogTitle>
                        </DialogHeader>
                        <div className="my-5">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="my-2 flex-grow items-center">
                                            <div className="w-full">
                                                <FormLabel htmlFor="name">Назва дисципліни</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        id="name"
                                                        placeholder="Введіть назву дисципліни"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="flex w-full items-start">
                                <FormField
                                    control={control}
                                    name="abbreviation"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 mr-2 flex w-1/2 items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="name">Аббревіатура</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="name"
                                                            placeholder="Введіть аббревіатуру"
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
                                    name="code"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 flex w-1/2 items-center">
                                                <div className="w-full">
                                                    <FormLabel htmlFor="code">Код</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            id="code"
                                                            placeholder="Введіть код"
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
                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="my-2 mr-2 flex w-full flex-grow items-center">
                                            <div className="w-full">
                                                <FormLabel htmlFor="name">Опис дисципліни</FormLabel>
                                                <FormControl>
                                                    <>
                                                        {isMarkdownPreview ? (
                                                            <ScrollArea
                                                                className="h-[9.875rem] overflow-y-auto rounded-md border border-border px-3 py-2"
                                                                scrollHideDelay={999}
                                                            >
                                                                <Markdown>{field.value}</Markdown>
                                                            </ScrollArea>
                                                        ) : (
                                                            <Textarea
                                                                className="resize-none"
                                                                id="description"
                                                                placeholder="Введіть опис дисципліни"
                                                                rows={7}
                                                                {...field}
                                                            />
                                                        )}
                                                        <Button
                                                            className="mt-2"
                                                            variant="secondary"
                                                            type="button"
                                                            size="sm"
                                                            onClick={toggleIsMarkdownPreview}
                                                        >
                                                            {isMarkdownPreview ? 'Редагувати' : 'Попередній перегляд'}
                                                        </Button>
                                                    </>
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="credits"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="my-2 mr-2 flex w-full flex-grow items-center">
                                            <div className="w-full">
                                                <FormLabel htmlFor="name">Кількість кредитів</FormLabel>
                                                <FormControl>
                                                    <NumericFormat
                                                        customInput={Input}
                                                        decimalScale={2}
                                                        thousandSeparator=","
                                                        value={field.value}
                                                        onValueChange={({ floatValue }) => {
                                                            field.onChange(floatValue);
                                                        }}
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
                                name="semesters"
                                render={({ field }) => {
                                    const selectedSemesters = field.value
                                        .map((item) => {
                                            return item.label;
                                        })
                                        .sort((a, b) => {
                                            return +a - +b;
                                        })
                                        .join(', ');

                                    return (
                                        <FormItem className="my-2 mr-2 flex w-full flex-grow items-center">
                                            <div className="w-full">
                                                <FormLabel htmlFor="courses">Семестри</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Input
                                                                id="courses"
                                                                placeholder="Виберіть номери семестрів"
                                                                contentEditable={false}
                                                                value={
                                                                    !selectedSemesters.trim()
                                                                        ? 'Виберіть семестри'
                                                                        : selectedSemesters
                                                                }
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className=" w-80" align="start" side="top">
                                                            {Object.entries(DISCIPLINE_SEMESTERS_OPTIONS).map(
                                                                ([key, options]) => {
                                                                    return (
                                                                        <>
                                                                            <h6 className="mb-1 ml-2 text-sm text-muted-foreground">
                                                                                {key}
                                                                            </h6>
                                                                            <div className="mb-2 flex flex-col">
                                                                                {options.map((option) => {
                                                                                    return (
                                                                                        <Button
                                                                                            key={option.value}
                                                                                            className="justify-between"
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            onClick={toggleSemesterItemHandler(
                                                                                                option
                                                                                            )}
                                                                                        >
                                                                                            {option.label}
                                                                                            {field?.value?.findIndex(
                                                                                                (item) => {
                                                                                                    return (
                                                                                                        item.value ===
                                                                                                        option.value
                                                                                                    );
                                                                                                }
                                                                                            ) !== -1 ? (
                                                                                                <CheckIcon size={16} />
                                                                                            ) : null}
                                                                                        </Button>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }
                                                            )}
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={control}
                                name="departmentLecturers"
                                render={({ field }) => {
                                    const selectedLecturers = field.value
                                        .map((item) => {
                                            return item.label;
                                        })
                                        .sort((a, b) => {
                                            return +a - +b;
                                        })
                                        .join(', ');

                                    return (
                                        <FormItem className="my-2 mr-2 flex w-full flex-grow items-center">
                                            <div className="w-full">
                                                <FormLabel htmlFor="courses">Викладачі від кафедри</FormLabel>
                                                <FormControl>
                                                    <Popover modal>
                                                        <PopoverTrigger asChild>
                                                            <Textarea
                                                                className="break-words"
                                                                id="courses"
                                                                placeholder="Виберіть викладачів від кафедри"
                                                                contentEditable={false}
                                                                value={
                                                                    !selectedLecturers.trim()
                                                                        ? 'Виберіть викладачів'
                                                                        : selectedLecturers
                                                                }
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className=" w-96" align="start" side="top">
                                                            <Input
                                                                type="search"
                                                                value={employeesSearch}
                                                                placeholder="Ведіть імʼя викладача"
                                                                onChange={(event) => {
                                                                    setEmployeesSearch(event.target.value);
                                                                }}
                                                            />
                                                            <Switch>
                                                                <Case condition={!employees?.length}>
                                                                    <div className=" h-[400px] items-center justify-center p-6">
                                                                        <p className="text-center text-muted-foreground">
                                                                            Нічого не знайдено
                                                                        </p>
                                                                    </div>
                                                                </Case>
                                                                <Case
                                                                    condition={
                                                                        employees !== undefined && !!employees?.length
                                                                    }
                                                                >
                                                                    <ScrollArea className="mt-3 h-[400px]">
                                                                        <div className="flex flex-col">
                                                                            {employees?.map((employee) => {
                                                                                return (
                                                                                    <Button
                                                                                        key={employee.id}
                                                                                        className="mb-2 justify-between"
                                                                                        variant="ghost"
                                                                                        onClick={() => {
                                                                                            toggleEmployeeItemHandler(
                                                                                                employee
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <span className="flex items-center truncate">
                                                                                            <Avatar className=" mr-3 h-8 w-8">
                                                                                                <AvatarImage
                                                                                                    className="object-cover"
                                                                                                    src={
                                                                                                        employee.image ??
                                                                                                        ''
                                                                                                    }
                                                                                                    alt={
                                                                                                        employee.name ??
                                                                                                        'No Name'
                                                                                                    }
                                                                                                />
                                                                                                <AvatarFallback>
                                                                                                    {getFirstLetters(
                                                                                                        employee.name ??
                                                                                                            ''
                                                                                                    )}
                                                                                                </AvatarFallback>
                                                                                            </Avatar>
                                                                                            <span className="truncate text-sm">
                                                                                                {employee.name ?? '--'}
                                                                                            </span>
                                                                                        </span>
                                                                                        {field.value.findIndex(
                                                                                            (person) => {
                                                                                                return (
                                                                                                    person.value ===
                                                                                                    employee.id
                                                                                                );
                                                                                            }
                                                                                        ) !== -1 ? (
                                                                                            <CheckIcon size={16} />
                                                                                        ) : null}
                                                                                    </Button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </ScrollArea>
                                                                </Case>
                                                            </Switch>
                                                            {field.value?.length ? (
                                                                <footer className="mt-4">
                                                                    <Button
                                                                        variant="secondary"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            field.onChange([]);
                                                                        }}
                                                                    >
                                                                        <DeleteIcon className="mr-2" size={16} />
                                                                        Очистити
                                                                    </Button>
                                                                </footer>
                                                            ) : null}
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
                        <FormField
                            control={control}
                            name="otherLecturers"
                            render={({ field }) => {
                                return (
                                    <>
                                        <Label htmlFor="otherLecturers">Інші викладачі</Label>
                                        <TagInput
                                            id="otherLecturers"
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
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="mt-2" variant="secondary" disabled={isSubjectUpdating}>
                                    Відмінити
                                </Button>
                            </DialogClose>
                            <Button className="ml-2 mt-2" type="submit" variant="default" disabled={isSubjectUpdating}>
                                {isSubjectUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Оновити
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default memo(UpdateSubjectDialog);
