import { memo, useCallback, useEffect } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import { Dialog, DialogContent, DialogTrigger } from '@/components/Dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { ArrowUpRightIcon, Check, Copy, ExternalLink, X } from 'lucide-react';
import { APP_HOSTNAME, DEFAULT_POSTER_URL, EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
import { api } from '@/utils/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { copyToClipboard, getFirstLetters } from '@/utils/common';
import Head from 'next/head';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useToggle } from '@/hooks/useToggle';
import { Switch, Case, Default } from '@/components/utils/Switch';
import Img from '@/components/Img';

const StaffModule: React.FC = () => {
    const [isCopyingEmail, toggleIsCopyingEmail] = useToggle();
    const [isCopyEmailError, toggleIsCopyEmailError] = useToggle();

    const utils = api.useUtils();

    const { toast } = useToast();

    const { data: staff } = api.employees.getAllEmployees.useQuery({
        search: '',
    });

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

    useEffect(() => {
        void utils.employees.getAllEmployees.invalidate();
    }, [utils.employees.getAllEmployees]);

    if (!staff) {
        return null;
    }

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
                <meta name="twitter:url" content={`${APP_HOSTNAME}/staff`} />
            </Head>
            <section className="container">
                <h2 className="my-8  text-center text-3xl font-black">Колектив кафедри</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {staff.map((employee) => {
                        return (
                            <Dialog key={employee.id}>
                                <Card className="group flex flex-col border-border bg-background/30 backdrop-blur dark:supports-[backdrop-filter]:bg-background/30">
                                    <CardHeader className="flex-grow">
                                        <CardTitle className="line-clamp-2" title={employee.name}>
                                            {employee.name}
                                        </CardTitle>
                                        {employee.academicStatus ? (
                                            <CardDescription>
                                                {EMPLOYEE_ACADEMIC_STATUSES[employee.academicStatus].label}
                                            </CardDescription>
                                        ) : null}
                                        <CardContent className="flex flex-grow flex-col items-start p-0 pt-5">
                                            {employee.image ? (
                                                <div className="h-full max-h-[350px] min-h-[300px] w-full flex-grow overflow-hidden rounded-lg">
                                                    <Img
                                                        wrapperClassName="h-full max-h-[350px]"
                                                        className="group-focus-visible:-110  h-full w-full object-cover transition-transform hover:scale-110 group-focus-within:scale-110 group-hover:scale-110 group-focus:scale-110"
                                                        src={employee.image}
                                                        alt={employee.name}
                                                        width={400}
                                                        height={300}
                                                    />
                                                </div>
                                            ) : null}
                                            <div className="flex flex-grow items-end">
                                                <DialogTrigger asChild>
                                                    <Button className="mt-5" variant="outline">
                                                        Детальніше
                                                        <ArrowUpRightIcon className="ml-2" size={16} />
                                                    </Button>
                                                </DialogTrigger>
                                            </div>
                                            <DialogContent>
                                                <div className="max-h-[500px]">
                                                    <h3 className="text-xl font-bold">{employee.name}</h3>
                                                    {employee.academicStatus ? (
                                                        <p className="text-muted-foreground">
                                                            {EMPLOYEE_ACADEMIC_STATUSES[employee.academicStatus].label}
                                                        </p>
                                                    ) : null}
                                                    <div className="my-4 flex items-center">
                                                        {employee.image ? (
                                                            <Avatar className="mr-2">
                                                                <AvatarImage
                                                                    className="object-cover"
                                                                    src={employee.image ?? ''}
                                                                    alt={employee.name}
                                                                />
                                                                <AvatarFallback>
                                                                    {getFirstLetters(employee.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ) : null}
                                                        <p className="text-muted-foreground">{employee.email}</p>
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
                                                                                employee.email
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
                                                        {employee.url ? (
                                                            <a
                                                                className=" inline-flex items-center text-accent-secondary"
                                                                href={employee.url}
                                                                target="_blank"
                                                            >
                                                                URL
                                                                <ExternalLink className="ml-1" size={16} />
                                                            </a>
                                                        ) : (
                                                            '--'
                                                        )}
                                                    </p>
                                                    <p>
                                                        <span className="text-muted-foreground">Дисципліни: </span>
                                                        {employee.disciplines?.length
                                                            ? employee.disciplines.map((discipline, index) => {
                                                                  return (
                                                                      <span
                                                                          key={discipline.id}
                                                                          className="mr-2 inline-block font-medium"
                                                                      >
                                                                          {discipline.name}({discipline.abbreviation})
                                                                          {index !== employee.disciplines.length - 1
                                                                              ? ', '
                                                                              : ''}
                                                                      </span>
                                                                  );
                                                              })
                                                            : '--'}
                                                    </p>
                                                </div>
                                            </DialogContent>
                                        </CardContent>
                                    </CardHeader>
                                </Card>
                            </Dialog>
                        );
                    })}
                </div>
            </section>
        </LandingLayout>
    );
};

export default memo(StaffModule);
