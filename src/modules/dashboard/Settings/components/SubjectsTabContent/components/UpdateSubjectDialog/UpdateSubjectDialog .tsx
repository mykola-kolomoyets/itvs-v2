import { memo, useCallback, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { CheckIcon, Loader2 } from 'lucide-react';
import type { Option } from '@/types';
import type { UpdateSubjectDialogProps, UpdateSubjectForm } from './types';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useToggle } from '@/hooks/useToggle';
import { useUpdateSubjectForm } from './hooks/useUpdateSubjectForm';
import { api } from '@/utils/api';
import { DISCIPLINE_COURSES_OPTIONS } from '@/constants';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { ScrollArea } from '@/components/ScrollArea';
import { Textarea } from '@/components/TextArea';
import Markdown from '@/components/Markdown';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

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

    const [isMarkdownPreview, toggleIsMarkdownPreview] = useToggle();

    const utils = api.useUtils();

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
                        'courses',
                        Object.values(DISCIPLINE_COURSES_OPTIONS)
                            .flat()
                            .filter((course) => {
                                return data.courses.split(',').includes(course.value);
                            })
                    );
                }
            },
        }
    );

    const { mutateAsync: updateSubject, isLoading: isSubjectUpdating } = api.subjects.updateSubject.useMutation({
        async onSuccess() {
            await utils.subjects.getAllSubjects.invalidate();
        },
    });

    const { toast } = useToast();

    const createSubjectHandler = useCallback(
        async ({ courses, ...rest }: UpdateSubjectForm) => {
            const newSubject = await updateSubject({
                ...rest,
                id: subjectId!,
                courses: courses.map((course) => {
                    return course.value;
                }),
            });

            onSuccess?.();

            onOpenChange?.(false);

            toast({
                title: 'Дисципліну успішно оновлено',
                description: (
                    <p>
                        Тег <strong>{newSubject.name}</strong> успішно оновлено.
                    </p>
                ),
            });
        },
        [onOpenChange, onSuccess, subjectId, toast, updateSubject]
    );

    const toggleCourseItemHandler = useCallback(
        (course: Option) => {
            return () => {
                const isIncluded =
                    form.getValues('courses').findIndex((item) => {
                        return item.value === course.value;
                    }) !== -1;

                if (isIncluded) {
                    form.setValue(
                        'courses',
                        form.getValues('courses').filter((item) => {
                            return item.value !== course.value;
                        })
                    );

                    return;
                }

                form.setValue('courses', [...form.getValues('courses'), course]);
            };
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
            const subjectCourses = subjectToEditData.courses.split(',');

            form.setValue('name', subjectToEditData.name);
            form.setValue('abbreviation', subjectToEditData.abbreviation ?? '');
            form.setValue('description', subjectToEditData.description);
            form.setValue('credits', subjectToEditData.credits);
            form.setValue(
                'courses',
                Object.values(DISCIPLINE_COURSES_OPTIONS)
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
                            <div className="flex w-full items-start">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 mr-2 flex w-3/5 flex-grow items-center">
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
                                <FormField
                                    control={control}
                                    name="abbreviation"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="my-2 flex w-2/5 items-center">
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
                                name="courses"
                                render={({ field }) => {
                                    const selectedCourses = field.value
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
                                                <FormLabel htmlFor="name">Курси</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Input
                                                                placeholder="Виберіть номери курсів"
                                                                contentEditable={false}
                                                                value={
                                                                    !selectedCourses.trim()
                                                                        ? 'Виберіть курси'
                                                                        : selectedCourses
                                                                }
                                                            />
                                                        </PopoverTrigger>
                                                        <PopoverContent className=" w-80" align="start" side="top">
                                                            {Object.entries(DISCIPLINE_COURSES_OPTIONS).map(
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
                                                                                            onClick={toggleCourseItemHandler(
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
                        </div>
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
