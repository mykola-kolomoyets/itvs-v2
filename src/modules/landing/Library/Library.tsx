import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/utils/api';
import LandingLayout from '@/components/layout/LandingLayout';
import Head from 'next/head';
import { APP_HOSTNAME, DEFAULT_POSTER_URL } from '@/constants';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/common';
import SubjectCardDataItem from '../Subjects/components/SubjectCardDataItem';
import { Badge } from '@/components/Badge';
import { Case, Default, Switch } from '@/components/utils/Switch';
import { Skeleton } from '@/components/Skeleton';

const LibraryModule: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearchQuery = useMemo(() => {
        return new URLSearchParams(Array.from(searchParams.entries()));
    }, [searchParams]);

    const searchValue = searchParams.get('search') ?? '';

    const debouncedSearchValue = useDebounce(searchValue);

    const {
        data: publications = [],
        isLoading,
        isRefetching,
        isFetching,
    } = api.libraryPublication.getAllLibraryPublications.useQuery({
        search: debouncedSearchValue,
    });

    return (
        <LandingLayout>
            <Head>
                <title>ІТВС | Бібліотека</title>
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
                <meta name="twitter:url" content={`${APP_HOSTNAME}/publications`} />
            </Head>
            <section className="container">
                <h2 className="my-8  text-center text-3xl font-black">Бібліотека</h2>
                <div className="mb-4 flex flex-col md:flex-row md:items-end">
                    <div className="flex-grow md:max-w-[500px]">
                        <Label htmlFor="search">Пошук</Label>
                        <Input
                            id="search"
                            type="search"
                            value={searchValue}
                            placeholder="Наприклад: НУЛП або Шевченко "
                            onChange={(event) => {
                                if (!event.target.value) {
                                    currentSearchQuery.delete('search');
                                } else {
                                    currentSearchQuery.set('search', event.target.value);
                                }

                                const search = currentSearchQuery.toString();
                                const query = search ? `?${search}` : '';

                                router.replace(`${pathname}${query}`);
                            }}
                        />
                    </div>
                </div>
                <Switch>
                    <Case condition={isLoading || isFetching || isRefetching}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, index) => {
                                return (
                                    <div key={index} className="h-[720px] w-full overflow-hidden rounded-lg">
                                        <Skeleton className="h-full w-full" />;
                                    </div>
                                );
                            })}
                        </div>
                    </Case>
                    <Case condition={!publications.length}>
                        <div className="flex items-center justify-center p-16">
                            <p className="text-base text-muted-foreground">Нічого не знайдено</p>
                        </div>
                    </Case>
                    <Default>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {publications.map((publication) => {
                                return (
                                    <Card
                                        key={publication.id}
                                        className="group flex flex-col border-border bg-background/30 backdrop-blur dark:supports-[backdrop-filter]:bg-background/30"
                                    >
                                        <CardHeader className="flex-grow">
                                            <CardTitle className="line-clamp-2" title={publication.title}>
                                                {publication.title}
                                            </CardTitle>
                                            <CardContent className="flex flex-grow flex-col items-start p-0 pt-3">
                                                <SubjectCardDataItem label="Видання" value={publication.publicator} />
                                                <div className="flex items-baseline">
                                                    <p className="pt-1 text-muted-foreground">Автори:&nbsp;</p>
                                                    <div>
                                                        {publication.authors.split(',').map((author) => {
                                                            return (
                                                                <Badge
                                                                    key={author}
                                                                    className="mr-2 mt-2"
                                                                    variant="secondary"
                                                                >
                                                                    {author}
                                                                </Badge>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {publication.posterUrl ? (
                                                    <div className="mt-6 h-full max-h-[calc(1280px/1.5)] min-h-[300px] w-full flex-grow overflow-hidden rounded-lg">
                                                        <Image
                                                            className="group-focus-visible:-110 h-full max-h-[calc(1280px/1.5)] w-full  object-cover transition-transform hover:scale-110 group-focus-within:scale-110 group-hover:scale-110 group-focus:scale-110"
                                                            src={publication.posterUrl}
                                                            alt={publication.title}
                                                            width={720}
                                                            height={956}
                                                            placeholder="blur"
                                                            blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                                                shimmer(720, 956)
                                                            )}`}
                                                        />
                                                    </div>
                                                ) : null}
                                            </CardContent>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </Default>
                </Switch>
            </section>
        </LandingLayout>
    );
};

export default LibraryModule;
