import { memo, useCallback, useEffect, useMemo } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/utils/api';
import { useDebounce } from '@/hooks/useDebounce';
import { ARTICLES_LIMIT } from './constants';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { Case, Switch } from '@/components/utils/Switch';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { getFirstLetters } from '@/utils/common';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowRightIcon, CheckIcon, Delete, DeleteIcon, RotateCcw, Tag, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import Image from 'next/image';
import { Skeleton } from '@/components/Skeleton';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { ScrollArea } from '@/components/ScrollArea';
import Pagination from '@/components/Pagination';

const ArticlesModule: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [authorSearchValue, debouncesAuthorSearchValue, setAuthorSearchValue] = useDebouncedState('');
    const [tagSearchValue, debouncesTagSearchValue, setTagSearchValue] = useDebouncedState('');

    const currentSearchQuery = useMemo(() => {
        return new URLSearchParams(Array.from(searchParams.entries()));
    }, [searchParams]);

    const searchValue = searchParams.get('search') ?? '';
    const page = Number(searchParams.get('page')) || 1;
    const tagsIds = searchParams.get('tags') ?? '';
    const authorsIds = searchParams.get('authors') ?? '';

    const tagsIdsArray = useMemo(() => {
        return tagsIds
            .split(',')
            .map((tag) => {
                return tag.trim();
            })
            .filter(Boolean);
    }, [tagsIds]);

    const authorsIdsArray = useMemo(() => {
        return authorsIds
            .split(',')
            .map((author) => {
                return author.trim();
            })
            .filter(Boolean);
    }, [authorsIds]);

    const debouncedSearchValue = useDebounce(searchValue);

    const { data: allTags } = api.tags.getAllTags.useQuery(
        {
            search: debouncesTagSearchValue,
        },
        {
            keepPreviousData: true,
        }
    );

    const { data: allUsers } = api.users.getAllUsers.useQuery(
        {
            search: debouncesAuthorSearchValue,
        },
        {
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        }
    );

    const { data: articlesResponse, isLoading: isArticlesLoading } = api.articles.getAllArticles.useInfiniteQuery(
        {
            search: debouncedSearchValue,
            limit: ARTICLES_LIMIT,
            skip: (page - 1) * ARTICLES_LIMIT,
            tags: tagsIdsArray,
            authors: authorsIdsArray,
        },
        {
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        }
    );
    const currentPageData = useMemo(() => {
        return articlesResponse?.pages[0] ?? null;
    }, [articlesResponse?.pages]);

    console.log(articlesResponse);

    const toggleTagsFilterHandler = useCallback(
        (value: string) => {
            if (tagsIdsArray.includes(value)) {
                currentSearchQuery.set(
                    'tags',
                    tagsIdsArray
                        .filter((id) => {
                            return id !== value;
                        })
                        .join(',')
                );
            } else {
                currentSearchQuery.set('tags', [...tagsIdsArray, value].join(','));
            }

            const search = currentSearchQuery.toString();
            const query = search ? `?${search}` : '';

            router.replace(`${pathname}${query}`);
        },
        [currentSearchQuery, pathname, router, tagsIdsArray]
    );

    const toggleAuthorFilterHandler = useCallback(
        (value: string) => {
            if (authorsIdsArray.includes(value)) {
                currentSearchQuery.set(
                    'authors',
                    authorsIdsArray
                        .filter((id) => {
                            return id !== value;
                        })
                        .join(',')
                );
            } else {
                currentSearchQuery.set('authors', [...authorsIdsArray, value].join(','));
            }

            const search = currentSearchQuery.toString();
            const query = search ? `?${search}` : '';

            router.replace(`${pathname}${query}`);
        },
        [authorsIdsArray, currentSearchQuery, pathname, router]
    );

    useEffect(() => {
        currentSearchQuery.set('page', '1');

        const search = currentSearchQuery.toString();
        const query = search ? `?${search}` : '';

        router.replace(`${pathname}${query}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchValue]);

    const selectedTags = useMemo(() => {
        return (
            allTags?.filter((tag) => {
                return tagsIdsArray.includes(tag.id);
            }) ?? []
        );
    }, [allTags, tagsIdsArray]);

    const selectedAuthors = useMemo(() => {
        return (
            allUsers?.users.filter((user) => {
                return authorsIdsArray.includes(user.id);
            }) ?? []
        );
    }, [allUsers?.users, authorsIdsArray]);

    return (
        <LandingLayout>
            <section className="container my-5 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-end">
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
                    <div className="mt-3 md:ml-5 md:mt-0">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="w-full md:ml-3 md:w-max" variant="secondary" title="Фільтр">
                                    <Tag className="mr-2" size={16} />
                                    <span>Вибрати теги</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                {!!allTags && !!allTags.length ? (
                                    <div>
                                        <div className="mb-2">
                                            <Input
                                                type="search"
                                                value={tagSearchValue}
                                                placeholder="Введіть назву тегу"
                                                onChange={(event) => {
                                                    setTagSearchValue(event.target.value);
                                                }}
                                            />
                                        </div>
                                        <ScrollArea className="h-[300px] max-h-[300px]">
                                            <div className="flex flex-col">
                                                {allTags.map((tag) => {
                                                    return (
                                                        <Button
                                                            key={tag.id}
                                                            className="mt-2 justify-between"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                toggleTagsFilterHandler(tag.id);
                                                            }}
                                                        >
                                                            {tag.name}
                                                            {tagsIds.includes(tag.id) ? <CheckIcon size={16} /> : null}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                        {tagsIds.length ? (
                                            <Button
                                                className="mt-2 justify-between"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    currentSearchQuery.delete('tags');

                                                    const search = currentSearchQuery.toString();
                                                    const query = search ? `?${search}` : '';

                                                    router.replace(`${pathname}${query}`);
                                                }}
                                            >
                                                <DeleteIcon className="mr-2" size={16} />
                                                Очистити
                                            </Button>
                                        ) : null}
                                    </div>
                                ) : null}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="mt-3 md:ml-1 md:mt-0">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="w-full md:ml-3 md:w-max" variant="secondary" title="Фільтр">
                                    <UsersIcon className="mr-2" size={16} />
                                    <span>Вибрати авторів</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div>
                                    <div className="mb-2">
                                        <Input
                                            type="search"
                                            value={authorSearchValue}
                                            placeholder="Введіть імʼя автора"
                                            onChange={(event) => {
                                                setAuthorSearchValue(event.target.value);
                                            }}
                                        />
                                    </div>
                                    <ScrollArea className="h-[300px] max-h-[300px]">
                                        <div className="flex flex-col">
                                            {allUsers && !!allUsers.users.length ? (
                                                allUsers.users.map((user) => {
                                                    return (
                                                        <Button
                                                            key={user.id}
                                                            className="mb-2 justify-between"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                toggleAuthorFilterHandler(user.id);
                                                            }}
                                                        >
                                                            <span className="flex items-center truncate">
                                                                <Avatar className=" mr-3 h-8 w-8">
                                                                    <AvatarImage
                                                                        src={user.image ?? ''}
                                                                        alt={user.name ?? 'No Name'}
                                                                    />
                                                                    <AvatarFallback>
                                                                        {getFirstLetters(user.name ?? '')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="truncate text-sm">
                                                                    {user.name ?? '--'}
                                                                </span>
                                                            </span>
                                                            {authorsIds.includes(user.id) ? (
                                                                <CheckIcon size={16} />
                                                            ) : null}
                                                        </Button>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex h-full items-center justify-center p-6">
                                                    <span>Не знайдено авторів</span>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                    {authorsIds.length ? (
                                        <Button
                                            className="mt-2 justify-between"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                currentSearchQuery.delete('authors');

                                                const search = currentSearchQuery.toString();
                                                const query = search ? `?${search}` : '';

                                                router.replace(`${pathname}${query}`);
                                            }}
                                        >
                                            <DeleteIcon className="mr-2" size={16} />
                                            Очистити
                                        </Button>
                                    ) : null}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="flex items-center">
                    {selectedTags.length || selectedAuthors.length ? (
                        <div className="my-6 flex flex-col">
                            {selectedTags.length ? (
                                <span className="mb-4 flex flex-wrap items-center">
                                    <p className="mt-2 text-base">Теги:</p>
                                    {selectedTags.map((tag) => {
                                        return (
                                            <Badge
                                                key={tag.id}
                                                className="ml-1 mr-1 mt-2"
                                                title={tag.name}
                                                variant="secondary"
                                                onClick={() => {
                                                    toggleTagsFilterHandler(tag.id);
                                                }}
                                            >
                                                {tag.name}
                                            </Badge>
                                        );
                                    })}
                                </span>
                            ) : null}
                            {selectedAuthors.length ? (
                                <span className="mb-4 flex flex-wrap items-center">
                                    <p className="mt-2 text-base">Автори:</p>
                                    {selectedAuthors.map((author) => {
                                        return (
                                            <Badge
                                                key={author.id}
                                                className="ml-1 mr-1 mt-2"
                                                title={author.name ?? '--'}
                                                variant="secondary"
                                                onClick={() => {
                                                    toggleAuthorFilterHandler(author.id);
                                                }}
                                            >
                                                {author.name}
                                            </Badge>
                                        );
                                    })}
                                </span>
                            ) : null}
                            <Button
                                className=" w-max"
                                variant="ghost"
                                size={'sm'}
                                onClick={() => {
                                    currentSearchQuery.set('page', '1');
                                    currentSearchQuery.delete('tags');
                                    currentSearchQuery.delete('authors');

                                    const search = currentSearchQuery.toString();
                                    const query = search ? `?${search}` : '';

                                    router.replace(`${pathname}${query}`);
                                }}
                            >
                                <RotateCcw className="mr-1" size={16} />
                                Очистити всі
                            </Button>
                        </div>
                    ) : null}
                </div>
            </section>
            <section className="container grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Switch>
                    <Case condition={isArticlesLoading}>
                        {Array.from({ length: 6 }).map((_, index) => {
                            return (
                                <Card key={index} className="flex h-full flex-col">
                                    <CardHeader className="flex-grow">
                                        <div className="flex items-center">
                                            <Skeleton className="h-8 w-32" />
                                        </div>
                                        <div className="mt-2 flex items-center">
                                            <Skeleton className="mr-3 h-8 w-8" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <div className="mt-2">
                                            <Skeleton className="h-[200px] w-full" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-32   " />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Case>
                    <Case condition={!!currentPageData?.articles?.length}>
                        {currentPageData?.articles.map((article) => {
                            return (
                                <article key={article.id} className="group h-full flex-grow cursor-pointer">
                                    <Card className=" group-focus:focus-primary-child group-focus-visible:focus-primary-child z-10  flex h-full flex-col bg-background/30 backdrop-blur transition-colors hover:border-accent-foreground dark:supports-[backdrop-filter]:bg-background/30">
                                        <CardHeader className="flex-grow">
                                            <Link className="group outline-none" href={`/articles/${article.slug}`}>
                                                <h2 className=" line-clamp-3 text-2xl font-bold" title={article.title}>
                                                    {article.title}
                                                </h2>
                                            </Link>
                                            <div className="flex items-center">
                                                <Avatar className=" mr-3 h-8 w-8">
                                                    <AvatarImage
                                                        src={article.author.image ?? ''}
                                                        alt={article.author.name ?? 'No Name'}
                                                    />
                                                    <AvatarFallback>
                                                        {getFirstLetters(article.author.name ?? '')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{article.author.name ?? '--'}</span>
                                            </div>
                                            {article.tags.length ? (
                                                <div className="">
                                                    <div className="mb-4 mt-2 flex-wrap items-center">
                                                        {article.tags.slice(0, 5).map((tag) => {
                                                            return (
                                                                <Badge
                                                                    key={tag.id}
                                                                    className="mr-2 mt-2"
                                                                    variant="secondary"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();

                                                                        toggleTagsFilterHandler(tag.id);
                                                                    }}
                                                                >
                                                                    {tag.name}
                                                                </Badge>
                                                            );
                                                        })}
                                                    </div>
                                                    {article.tags.length > 5 ? (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="group outline-none">
                                                                    <Badge
                                                                        className="group-focus:focus-primary-child group-focus-visible:focus-primary-child mr-2"
                                                                        variant="outline"
                                                                    >
                                                                        + ще {article.tags.length - 5} тегів
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent align="start" side="bottom">
                                                                    <div className="flex max-w-[300px] flex-wrap p-3 pt-2">
                                                                        {article.tags.slice(5).map((tag) => {
                                                                            return (
                                                                                <Badge
                                                                                    key={tag.id}
                                                                                    className="mr-2 mt-2"
                                                                                    variant="secondary"
                                                                                    onClick={(event) => {
                                                                                        event.stopPropagation();

                                                                                        toggleTagsFilterHandler(tag.id);
                                                                                    }}
                                                                                >
                                                                                    {tag.name}
                                                                                </Badge>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                            <div className="pt-4">
                                                {article?.posterUrl ? (
                                                    <div className="overflow-hidden rounded-lg">
                                                        <Image
                                                            className="group-focus-visible:-110 h-[200px] w-full object-cover transition-transform hover:scale-110 group-focus-within:scale-110 group-hover:scale-110 group-focus:scale-110"
                                                            src={article.posterUrl}
                                                            alt={article.title}
                                                            width={400}
                                                            height={200}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex h-[200px] items-center justify-center rounded-lg bg-accent">
                                                        <span className="text-sm text-accent-foreground">
                                                            Стаття без зображення
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <Button asChild>
                                                <Link href={`/articles/${article.slug}`}>
                                                    <span>Детальніше</span>
                                                    <ArrowRightIcon className="ml-2" size={16} />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </article>
                            );
                        })}
                        {currentPageData?.nextCursor ??
                        (currentPageData && currentPageData?.articles?.length < currentPageData?.total) ? (
                            <Pagination
                                className="container col-span-full rounded-lg border border-border bg-background/30 backdrop-blur dark:supports-[backdrop-filter]:bg-background/30"
                                count={currentPageData?.total ?? 0}
                                page={page}
                                limit={ARTICLES_LIMIT}
                                onPageChange={(newPage) => {
                                    currentSearchQuery.set('page', (newPage ?? 1).toString());

                                    const search = currentSearchQuery.toString();
                                    const query = search ? `?${search}` : '';

                                    router.replace(`${pathname}${query}`);
                                }}
                            />
                        ) : null}
                    </Case>
                </Switch>
            </section>
        </LandingLayout>
    );
};

export default memo(ArticlesModule);
