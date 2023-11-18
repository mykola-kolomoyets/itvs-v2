import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { CheckIcon, ChevronDown, ListFilterIcon, Loader2, MoreHorizontal, RotateCcw } from 'lucide-react';
import type { ArticleForTableItem } from '@/types';
import type { ColumnDef, ColumnFiltersState, VisibilityState } from '@tanstack/react-table';
import { useMePermissions } from '@/hooks/useMePermissions';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { cn, formatDate } from '@/utils/common';
import { api } from '@/utils/api';
import { ARTICLES_LIMIT } from './constants';
import Pagination from '@/components/Pagination';
import UserRole from '@/components/UserRole';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Badge } from '@/components/Badge';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import ArticlesTableSkeleton from './components/ArticlesTableSkeleton';
import RemoveArticleDialog from './components/RemoveArticleDialog';
import { useToggle } from '@/hooks/useToggle';
import { ScrollArea } from '@/components/ScrollArea';

const ArticlesTable: React.FC = () => {
    const { user, permissions } = useMePermissions();

    const [page, setPage] = useState(1);
    const [searchValue, debouncedSearchValue, setSearchValue] = useDebouncedState('');
    const [isRemoveArticleDialogOpen, , setIsRemoveArticleDialogOpen] = useToggle();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [selectedArticleId, setSelectedArticleId] = useState<string>('');
    const [selectedFilterTagsIds, setSelectedFilterTagsIds] = useState<string[]>([]);

    const {
        data: articlesResponse,
        isLoading: isArticlesListLoading,
        isRefetching: isArticlesListRefetching,
    } = api.articles.getAllArticles.useInfiniteQuery(
        {
            search: debouncedSearchValue.trim(),
            limit: ARTICLES_LIMIT,
            skip: (page - 1) * ARTICLES_LIMIT,
            author: permissions.canViewOnlyOwnArticles ? user?.id : undefined,
            tags: selectedFilterTagsIds,
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.nextCursor;
            },
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );

    const { data: allTags } = api.tags.getAllTags.useQuery({
        search: '',
    });

    const currentPage = articlesResponse?.pages[0];

    const currentPageArticles = useMemo(() => {
        return currentPage?.articles ?? [];
    }, [currentPage]);

    const selectedTags = useMemo(() => {
        return (
            allTags?.filter((tag) => {
                return selectedFilterTagsIds.includes(tag.id);
            }) ?? []
        );
    }, [allTags, selectedFilterTagsIds]);

    const columns = useMemo<ColumnDef<ArticleForTableItem>[]>(() => {
        const initialColumns: ColumnDef<ArticleForTableItem>[] = [
            {
                accessorKey: 'title',
                header: 'Назва',
                id: 'Назва',
                enableHiding: false,
                cell({ getValue }) {
                    const articleTitle = getValue<string>();

                    return <p className="text-base ">{articleTitle}</p>;
                },
            },
            {
                accessorKey: 'author',
                header: 'Автор',
                id: 'Автор',
                enableHiding: false,
                cell({ getValue }) {
                    const author = getValue<ArticleForTableItem['author']>();

                    return (
                        <div>
                            <p className="text-base ">
                                {author.name} {author.id === user?.id ? '(Ви)' : ''}
                            </p>
                            <UserRole role={author.role} />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'tags',
                header: 'Теги',
                id: 'Теги',
                cell({ getValue }) {
                    const tags = getValue<ArticleForTableItem['tags']>();

                    return (
                        <div>
                            {tags.map((tag) => {
                                return (
                                    <Badge key={tag.id} className="mr-2" variant="secondary">
                                        {tag.name}
                                    </Badge>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Дата створення',
                id: 'Дата створення',
                maxSize: 100,
                cell({ getValue }) {
                    const createdAt = getValue<ArticleForTableItem['createdAt']>();

                    return <p className="text-base ">{formatDate(createdAt)}</p>;
                },
            },
            {
                accessorKey: 'id',
                header: '',
                enableHiding: false,
                minSize: 64,
                maxSize: 64,
                size: 64,
                cell: ({ getValue }) => {
                    const articleId = getValue<string>();

                    return (
                        <div className="flex w-full justify-end pr-4">
                            <DropdownMenu>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Відкрити меню</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Додаткові дії</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Дії</DropdownMenuLabel>
                                    <DropdownMenuItem disabled>Відкрити</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem disabled>Редагувати</DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedArticleId(articleId);
                                            setIsRemoveArticleDialogOpen(true);
                                        }}
                                    >
                                        Видалити
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ];

        if (permissions.canViewOnlyOwnArticles) {
            return initialColumns.filter((column) => {
                return column.id !== 'Автор';
            });
        }

        return initialColumns;
    }, [permissions.canViewOnlyOwnArticles, setIsRemoveArticleDialogOpen, user?.id]);
    const table = useReactTable({
        data: currentPageArticles ?? [],
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            columnVisibility,
        },
    });

    const toggleTagsFilterHandler = useCallback(
        (value: string) => {
            if (selectedFilterTagsIds.includes(value)) {
                setSelectedFilterTagsIds((prev) => {
                    return prev.filter((id) => {
                        return id !== value;
                    });
                });

                return;
            }

            setSelectedFilterTagsIds((prev) => {
                return [...prev, value];
            });
        },
        [selectedFilterTagsIds]
    );

    if (isArticlesListLoading && !isArticlesListRefetching) {
        return <ArticlesTableSkeleton />;
    }

    if (!debouncedSearchValue.trim() && !articlesResponse?.pages[0]?.total) {
        return (
            <div className="container my-16 flex w-full flex-col items-center">
                <Image
                    className="dark:rounded-2xl dark:bg-foreground dark:py-5"
                    src="/images/empty.png"
                    width={316}
                    height={202}
                    alt="Ще нічого не опубліковано"
                />
                <h3 className="mt-3 text-center text-base">
                    {permissions.canViewOnlyOwnArticles
                        ? 'Ви ще не опублікували жодної статті'
                        : 'Ще нічого не опубліковано'}
                </h3>
                <Button className="mt-3" variant="default" asChild>
                    <Link href="/create-article">Написати статтю</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="my-6">
                <div className="container mb-4 flex items-end justify-between">
                    <div className="flex items-end">
                        <div className="w-[24.0625rem]">
                            <Label htmlFor="search">Пошук</Label>
                            <Input
                                type="search"
                                id="search"
                                placeholder="Наприклад: НУЛП або Шевченко "
                                value={searchValue}
                                onChange={(event) => {
                                    setSearchValue(event.target.value);
                                }}
                            />
                        </div>
                        {!!allTags && !!allTags.length ? (
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="ml-3" variant="ghost" size="icon" title="Фільтр">
                                            <ListFilterIcon size={20} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80" align="start">
                                        <h6 className="mb-1 ml-4 text-sm">Теги</h6>
                                        <ScrollArea className="max-h-[500px]">
                                            <div className="flex flex-col">
                                                {allTags.map((tag) => {
                                                    return (
                                                        <Button
                                                            key={tag.id}
                                                            className="justify-between"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                toggleTagsFilterHandler(tag.id);
                                                            }}
                                                        >
                                                            {tag.name}
                                                            {selectedFilterTagsIds.includes(tag.id) ? (
                                                                <CheckIcon size={16} />
                                                            ) : null}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ) : null}
                        {isArticlesListRefetching ? (
                            <div className="ml-4 py-3">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : null}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Колонки <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="container flex items-center">
                    {selectedFilterTagsIds.length ? (
                        <div className="mb-6 flex items-center">
                            <p className="mr-2 text-base">Теги:</p>
                            {selectedTags.map((tag) => {
                                return (
                                    <Badge
                                        key={tag.id}
                                        className="mr-1"
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

                            <Button
                                className="ml-2"
                                variant="ghost"
                                size={'sm'}
                                onClick={() => {
                                    setSelectedFilterTagsIds([]);
                                }}
                            >
                                <RotateCcw className="mr-1" size={16} />
                                Очистити всі
                            </Button>
                        </div>
                    ) : null}
                </div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn({
                                                'pl-7': index === 0,
                                            })}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell, index) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn({
                                                'pl-7': index === 0,
                                            })}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    На жаль, не було знайдено потрібних статтей. Спробуйте інший запит
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {currentPageArticles?.length ? (
                    <Pagination
                        className="container"
                        count={currentPage?.total ?? 0}
                        page={page}
                        limit={ARTICLES_LIMIT}
                        onPageChange={(newPage) => {
                            setPage(newPage ?? 1);
                        }}
                    />
                ) : null}
            </div>
            <RemoveArticleDialog
                open={isRemoveArticleDialogOpen}
                onOpenChange={setIsRemoveArticleDialogOpen}
                id={selectedArticleId}
                onSuccess={() => {
                    setSelectedArticleId('');
                }}
            />
        </>
    );
};

export default memo(ArticlesTable);
