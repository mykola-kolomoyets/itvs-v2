// import SubjectModule from '@/modules/Subject';
import type { NextPage } from 'next';
import { useCallback } from 'react';
import { APP_HOSTNAME, DEFAULT_POSTER_URL, EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
import LandingLayout from '@/components/layout/LandingLayout';
import Head from 'next/head';
import { api } from '@/utils/api';
import { useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { ArrowLeft, Check, Copy, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';
import SubjectCardDataItem from '@/modules/landing/Subjects/components/SubjectCardDataItem';
import { Dialog, DialogContent, DialogTrigger } from '@/components/Dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { copyToClipboard, getFirstLetters } from '@/utils/common';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useToggle } from '@/hooks/useToggle';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { Case, Default, Switch } from '@/components/utils/Switch';
import { Badge } from '@/components/Badge';
import Markdown from '@/components/Markdown';

const SubjectPage: NextPage = () => {
    const params = useParams<{ id: string }>();

    const { toast } = useToast();

    const [isCopyingEmail, toggleIsCopyingEmail] = useToggle();
    const [isCopyEmailError, toggleIsCopyEmailError] = useToggle();

    const { data: subject } = api.subjects.getSubjectItem.useQuery({
        id: params.id,
    });

    const getMetaTitle = useCallback(() => {
        return `ІТВС | ${subject?.name}`;
    }, [subject?.name]);

    const getMetaPageUrl = useCallback(() => {
        return `${APP_HOSTNAME}/subjects/${subject?.id}`;
    }, [subject?.id]);

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

    if (!subject) {
        return null;
    }

    return (
        <LandingLayout>
            <Head>
                <title>ІТВС | {subject.name}</title>
                <link rel="icon" href="/images/logo-mini.svg" />
                <meta name="robots" content="all" />
                <meta name="description" content={subject.name} />
                <meta property="og:image" content={DEFAULT_POSTER_URL} />
                <meta property="og:title" content={getMetaTitle()} />
                <meta property="og:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={APP_HOSTNAME} />
                <meta name="twitter:title" content={getMetaTitle()} />
                <meta name="twitter:description" content="Кафедра Інформаційних Технологій Видавничої Справи" />
                <meta name="twitter:image" content={DEFAULT_POSTER_URL} />
                <meta name="twitter:url" content={getMetaPageUrl()} />
            </Head>
            <div className=" container mt-10 max-w-[1080px]">
                <Button className="mb-5" variant="ghost" asChild>
                    <Link href="/subjects">
                        <ArrowLeft className="mr-2" size={16} />
                        Назад до дисциплін
                    </Link>
                </Button>
                <h1 className="text-4xl font-bold">{subject.name}</h1>
                <div className="my-6">
                    <SubjectCardDataItem className="mb-2" label="Абреваітура" value={subject.abbreviation ?? '--'} />
                    <SubjectCardDataItem className="mb-2" label="Код" value={subject.code ?? '--'} />
                </div>
                <div className="flex-grow">
                    <p className="text-base text-muted-foreground">Викладачі</p>

                    {subject.departmentLecturers.length ? (
                        <div className="mt-1 flex flex-col">
                            {subject.departmentLecturers.map((lecturer) => {
                                return (
                                    <Dialog key={lecturer.id}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="group mb-3 inline-flex w-max cursor-pointer items-center justify-start"
                                            >
                                                <Avatar className=" mr-3 h-8 w-8">
                                                    <AvatarImage
                                                        className="object-cover"
                                                        src={lecturer.image ?? ''}
                                                        alt={lecturer.name ?? 'No Name'}
                                                    />
                                                    <AvatarFallback>
                                                        {getFirstLetters(lecturer.name ?? '')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="truncate text-sm group-hover:underline">
                                                    {lecturer.name ?? '--'}
                                                </span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <div className="max-h-[500px]">
                                                <h3 className="text-xl font-bold">{lecturer.name}</h3>
                                                {lecturer.academicStatus ? (
                                                    <p className="text-muted-foreground">
                                                        {EMPLOYEE_ACADEMIC_STATUSES[lecturer.academicStatus].label}
                                                    </p>
                                                ) : null}
                                                <div className="my-4 flex items-center">
                                                    {lecturer.image ? (
                                                        <Avatar className="mr-2">
                                                            <AvatarImage
                                                                className="object-cover"
                                                                src={lecturer.image ?? ''}
                                                                alt={lecturer.name}
                                                            />
                                                            <AvatarFallback>
                                                                {getFirstLetters(lecturer.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ) : null}
                                                    <p className="text-muted-foreground">{lecturer.email}</p>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    className="ml-auto"
                                                                    size="icon"
                                                                    variant="outline"
                                                                    onClick={(event) => {
                                                                        event.preventDefault();

                                                                        void copyEmailToClipboardHandler(
                                                                            lecturer.email
                                                                        );
                                                                    }}
                                                                >
                                                                    <Switch>
                                                                        <Case condition={isCopyingEmail}>
                                                                            <Check
                                                                                className="animate-fade-in text-green-600"
                                                                                size={16}
                                                                            />
                                                                        </Case>
                                                                        <Case condition={isCopyEmailError}>
                                                                            <X
                                                                                className="animate-fade-in text-red-600"
                                                                                size={16}
                                                                            />
                                                                        </Case>
                                                                        <Default>
                                                                            <Copy
                                                                                className="animate-fade-in"
                                                                                size={16}
                                                                            />
                                                                        </Default>
                                                                    </Switch>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Копіювати email</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <p>
                                                    <span className="text-muted-foreground">Wiki: </span>
                                                    {lecturer.url ? (
                                                        <a
                                                            className=" inline-flex items-center text-accent-secondary"
                                                            href={lecturer.url}
                                                            target="_blank"
                                                        >
                                                            URL
                                                            <ExternalLink className="ml-1" size={16} />
                                                        </a>
                                                    ) : (
                                                        '--'
                                                    )}
                                                </p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                );
                            })}
                        </div>
                    ) : null}

                    {subject.otherLecturers.length ? (
                        <div className="mt-1 flex flex-wrap gap-3">
                            {subject.otherLecturers.split(',').map((lecturer) => {
                                return <Badge key={lecturer}>{lecturer}</Badge>;
                            })}
                        </div>
                    ) : null}
                </div>
                <div>
                    <Markdown>{subject.description}</Markdown>
                </div>
            </div>
        </LandingLayout>
    );
};

export default SubjectPage;
