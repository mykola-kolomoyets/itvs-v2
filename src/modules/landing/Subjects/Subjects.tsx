import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import LandingLayout from '@/components/layout/LandingLayout';
import { Case, Default, Switch } from '@/components/utils/Switch';
import { APP_HOSTNAME, DEFAULT_POSTER_URL, EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
// import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/utils/api';
import Head from 'next/head';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo } from 'react';
import SubjectCardDataItem from './components/SubjectCardDataItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { copyToClipboard, getFirstLetters } from '@/utils/common';
import { Dialog, DialogContent, DialogTrigger } from '@/components/Dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { Button } from '@/components/Button';
import { useToggle } from '@/hooks/useToggle';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { ArrowUpRightIcon, Check, Copy, ExternalLink, X } from 'lucide-react';
import { Badge } from '@/components/Badge';
import Link from 'next/link';
import { Skeleton } from '@/components/Skeleton';
import { useDebouncedState } from '@/hooks/useDebouncedState';

const SubjectsModule: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { toast } = useToast();

    const [isCopyingEmail, toggleIsCopyingEmail] = useToggle();
    const [isCopyEmailError, toggleIsCopyEmailError] = useToggle();

    const currentSearchQuery = useMemo(() => {
        return new URLSearchParams(Array.from(searchParams.entries()));
    }, [searchParams]);

    const [searchValue, debouncedSearchValue, setSearchValue] = useDebouncedState('');

    const { data: subjects, isLoading } = api.subjects.getAllSubjectsBySemesters.useQuery({
        search: debouncedSearchValue,
    });

    useEffect(() => {
        if (!searchParams.get('search') || !searchParams.has('search')) {
            currentSearchQuery.set('search', '');
            router.replace(`${pathname}?${currentSearchQuery.toString()}`);
        }
    }, [currentSearchQuery, pathname, router, searchParams]);

    const copyEmailToClipboardHandler = useCallback(
        async (email: string) => {
            await copyToClipboard(
                email,
                () => {
                    toggleIsCopyingEmail();
                    toast({
                        title: 'Пошта скопійована',
                        description: `Пошта ${email} скопійована в буфер обміну`,
                    });

                    setTimeout(() => {
                        toggleIsCopyingEmail();
                    }, 1000);
                },
                () => {
                    toggleIsCopyEmailError();

                    toast({
                        title: 'Пошта  не була скопійована',
                        description:
                            'Виникла помилка під час копіювання пошти. Спробуйте ще раз пізніше, або скопіюйте вручну за допомогою клавіш Ctrl+C',
                        variant: 'destructive',
                    });

                    setTimeout(() => {
                        toggleIsCopyEmailError();
                    }, 1000);
                }
            );
        },
        [toast, toggleIsCopyEmailError, toggleIsCopyingEmail]
    );

    return (
        <LandingLayout>
            <Head>
                <title>ІТВС | Колектив кафедри</title>
                <link rel="icon" href="/images/logo-mini.svg" />
                <meta name="robots" content="all" />
                <meta name="description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta property="og:image" content={DEFAULT_POSTER_URL} />
                <meta property="og:title" content="ІТВС" />
                <meta property="og:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={APP_HOSTNAME} />
                <meta name="twitter:title" content="ІТВС" />
                <meta name="twitter:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:image" content={DEFAULT_POSTER_URL} />
                <meta name="twitter:url" content={`${APP_HOSTNAME}/subjects`} />
            </Head>
            <section className="container">
                <h2 className="my-8  text-center text-3xl font-black">Дисципліни</h2>
                <div className="flex flex-col md:flex-row md:items-end">
                    <div className="flex-grow md:max-w-[500px]">
                        <Label htmlFor="search">Пошук</Label>
                        <Input
                            id="search"
                            type="search"
                            value={searchValue}
                            placeholder="Наприклад: НУЛП або Шевченко "
                            onChange={(event) => {
                                setSearchValue(event.target.value);
                                // if (!event.target.value) {
                                // currentSearchQuery.delete('search');
                                // } else {
                                // currentSearchQuery.set('search', event.target.value);
                                // // }

                                // const search = currentSearchQuery.toString();
                                // const query = search ? `?${search}` : '';

                                // router.replace(`${pathname}${query}`);
                            }}
                        />
                    </div>
                </div>

                <Switch>
                    <Case condition={isLoading}>
                        <div className="mt-6 flex flex-col gap-3">
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="h-[56px] w-full overflow-hidden rounded-lg  ">
                                <Skeleton className="h-full w-full" />
                            </div>
                        </div>
                    </Case>
                    <Case condition={!Object.keys(subjects ?? {}).length}>
                        <div className="flex items-center justify-center p-16">
                            <p className="text-base text-muted-foreground">Нічого не знайдено</p>
                        </div>
                    </Case>
                    <Default>
                        <div className="mt-6">
                            <Accordion type="multiple">
                                {Object.entries(subjects ?? {}).map(([semesterNumber, semesterSubjects]) => {
                                    return (
                                        <AccordionItem key={semesterNumber} value={semesterNumber}>
                                            <AccordionTrigger className="text-lg">
                                                {semesterNumber} семестр
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid  gap-3 md:grid-cols-2 xl:grid-cols-3">
                                                    {semesterSubjects.map((subject) => {
                                                        return (
                                                            <Card key={subject.id} className="flex  flex-col md:w-full">
                                                                <CardHeader>
                                                                    <CardTitle
                                                                        className="line-clamp-3 text-lg md:text-2xl"
                                                                        title={subject.name}
                                                                    >
                                                                        {subject.name}
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="flex-shrink flex-grow">
                                                                    <div className="flex h-full min-w-[200px] flex-grow flex-col">
                                                                        <SubjectCardDataItem
                                                                            className="mb-2"
                                                                            label="Абреваітура"
                                                                            value={subject.abbreviation ?? '--'}
                                                                        />
                                                                        <SubjectCardDataItem
                                                                            className="mb-2"
                                                                            label="Код"
                                                                            value={subject.code ?? '--'}
                                                                        />
                                                                        <SubjectCardDataItem
                                                                            className="mb-2"
                                                                            label="Кредити"
                                                                            value={subject.credits.toFixed(2)}
                                                                        />
                                                                        <div className="flex-grow">
                                                                            <p className="text-base text-muted-foreground">
                                                                                Викладачі
                                                                            </p>

                                                                            {subject.departmentLecturers.length ? (
                                                                                <div className="mt-1 flex  flex-wrap gap-3">
                                                                                    {subject.departmentLecturers.map(
                                                                                        (lecturer) => {
                                                                                            return (
                                                                                                <Dialog
                                                                                                    key={lecturer.id}
                                                                                                >
                                                                                                    <DialogTrigger
                                                                                                        asChild
                                                                                                    >
                                                                                                        <Button
                                                                                                            variant="ghost"
                                                                                                            className="group mb-3 inline-flex w-max flex-shrink cursor-pointer items-center justify-start"
                                                                                                        >
                                                                                                            <Avatar className=" mr-3 h-8 w-8">
                                                                                                                <AvatarImage
                                                                                                                    className="object-cover"
                                                                                                                    src={
                                                                                                                        lecturer.image ??
                                                                                                                        ''
                                                                                                                    }
                                                                                                                    alt={
                                                                                                                        lecturer.name ??
                                                                                                                        'No Name'
                                                                                                                    }
                                                                                                                />
                                                                                                                <AvatarFallback>
                                                                                                                    {getFirstLetters(
                                                                                                                        lecturer.name ??
                                                                                                                            ''
                                                                                                                    )}
                                                                                                                </AvatarFallback>
                                                                                                            </Avatar>
                                                                                                            <span className="hidden w-full truncate text-sm group-hover:underline sm:block">
                                                                                                                {lecturer.name ??
                                                                                                                    '--'}
                                                                                                            </span>
                                                                                                        </Button>
                                                                                                    </DialogTrigger>
                                                                                                    <DialogContent>
                                                                                                        <div className="max-h-[500px]">
                                                                                                            <h3 className="text-xl font-bold">
                                                                                                                {
                                                                                                                    lecturer.name
                                                                                                                }
                                                                                                            </h3>
                                                                                                            {lecturer.academicStatus ? (
                                                                                                                <p className="text-muted-foreground">
                                                                                                                    {
                                                                                                                        EMPLOYEE_ACADEMIC_STATUSES[
                                                                                                                            lecturer
                                                                                                                                .academicStatus
                                                                                                                        ]
                                                                                                                            .label
                                                                                                                    }
                                                                                                                </p>
                                                                                                            ) : null}
                                                                                                            <div className="my-4 flex items-center">
                                                                                                                {lecturer.image ? (
                                                                                                                    <Avatar className="mr-2">
                                                                                                                        <AvatarImage
                                                                                                                            className="object-cover"
                                                                                                                            src={
                                                                                                                                lecturer.image ??
                                                                                                                                ''
                                                                                                                            }
                                                                                                                            alt={
                                                                                                                                lecturer.name
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <AvatarFallback>
                                                                                                                            {getFirstLetters(
                                                                                                                                lecturer.name
                                                                                                                            )}
                                                                                                                        </AvatarFallback>
                                                                                                                    </Avatar>
                                                                                                                ) : null}
                                                                                                                <p className="text-muted-foreground">
                                                                                                                    {
                                                                                                                        lecturer.email
                                                                                                                    }
                                                                                                                </p>
                                                                                                                <TooltipProvider>
                                                                                                                    <Tooltip>
                                                                                                                        <TooltipTrigger
                                                                                                                            asChild
                                                                                                                        >
                                                                                                                            <Button
                                                                                                                                className="ml-auto"
                                                                                                                                size="icon"
                                                                                                                                variant="outline"
                                                                                                                                onClick={(
                                                                                                                                    event
                                                                                                                                ) => {
                                                                                                                                    event.preventDefault();

                                                                                                                                    void copyEmailToClipboardHandler(
                                                                                                                                        lecturer.email
                                                                                                                                    );
                                                                                                                                }}
                                                                                                                            >
                                                                                                                                <Switch>
                                                                                                                                    <Case
                                                                                                                                        condition={
                                                                                                                                            isCopyingEmail
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        <Check
                                                                                                                                            className="animate-fade-in text-green-600"
                                                                                                                                            size={
                                                                                                                                                16
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </Case>
                                                                                                                                    <Case
                                                                                                                                        condition={
                                                                                                                                            isCopyEmailError
                                                                                                                                        }
                                                                                                                                    >
                                                                                                                                        <X
                                                                                                                                            className="animate-fade-in text-red-600"
                                                                                                                                            size={
                                                                                                                                                16
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </Case>
                                                                                                                                    <Default>
                                                                                                                                        <Copy
                                                                                                                                            className="animate-fade-in"
                                                                                                                                            size={
                                                                                                                                                16
                                                                                                                                            }
                                                                                                                                        />
                                                                                                                                    </Default>
                                                                                                                                </Switch>
                                                                                                                            </Button>
                                                                                                                        </TooltipTrigger>
                                                                                                                        <TooltipContent>
                                                                                                                            Копіювати
                                                                                                                            email
                                                                                                                        </TooltipContent>
                                                                                                                    </Tooltip>
                                                                                                                </TooltipProvider>
                                                                                                            </div>
                                                                                                            <p>
                                                                                                                <span className="text-muted-foreground">
                                                                                                                    Wiki:{' '}
                                                                                                                </span>
                                                                                                                {lecturer.url ? (
                                                                                                                    <a
                                                                                                                        className=" inline-flex items-center text-accent-secondary"
                                                                                                                        href={
                                                                                                                            lecturer.url
                                                                                                                        }
                                                                                                                        target="_blank"
                                                                                                                    >
                                                                                                                        URL
                                                                                                                        <ExternalLink
                                                                                                                            className="ml-1"
                                                                                                                            size={
                                                                                                                                16
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </a>
                                                                                                                ) : (
                                                                                                                    '--'
                                                                                                                )}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </DialogContent>
                                                                                                </Dialog>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </div>
                                                                            ) : null}

                                                                            {subject.otherLecturers.length ? (
                                                                                <div className="mt-1 flex flex-wrap gap-3">
                                                                                    {subject.otherLecturers
                                                                                        .split(',')
                                                                                        .map((lecturer) => {
                                                                                            return (
                                                                                                <Badge
                                                                                                    key={lecturer}
                                                                                                    variant="outline"
                                                                                                >
                                                                                                    {lecturer}
                                                                                                </Badge>
                                                                                            );
                                                                                        })}
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                        <div>
                                                                            <Button
                                                                                className="mt-4"
                                                                                variant="outline"
                                                                                asChild
                                                                            >
                                                                                <Link href={`/subjects/${subject.id}`}>
                                                                                    Детальніше
                                                                                    <ArrowUpRightIcon
                                                                                        className="ml-2"
                                                                                        size={16}
                                                                                    />
                                                                                </Link>
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </Default>
                </Switch>
            </section>
        </LandingLayout>
    );
};

export default memo(SubjectsModule);
