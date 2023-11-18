import { memo, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Loader2, MoreHorizontal } from "lucide-react";
import type { ArticleForTableItem } from "@/types";
import type {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { useMePermissions } from "@/hooks/useMePermissions";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { cn, formatDate } from "@/utils/common";
import { api } from "@/utils/api";
import { ARTICLES_LIMIT } from "./constants";
import Pagination from "@/components/Pagination";
import UserRole from "@/components/UserRole";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Badge } from "@/components/Badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import ArticlesTableSkeleton from "./components/ArticlesTableSkeleton";

const ArticlesTable: React.FC = () => {
  const { user, permissions } = useMePermissions();

  const [page, setPage] = useState(1);
  const [searchValue, debouncedSearchValue, setSearchValue] =
    useDebouncedState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    data: articlesResponse,
    isLoading: isArticlesListLoading,
    isRefetching: isArticlesListRefetching,
  } = api.article.getAllArticles.useInfiniteQuery(
    {
      search: debouncedSearchValue.trim(),
      limit: ARTICLES_LIMIT,
      skip: (page - 1) * ARTICLES_LIMIT,
      author: permissions.canViewOnlyOwnArticles ? user?.id : undefined,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  const currentPage = articlesResponse?.pages[0];
  const currentPageArticles = useMemo(() => {
    return currentPage?.articles ?? [];
  }, [currentPage]);

  const columns = useMemo<ColumnDef<ArticleForTableItem>[]>(() => {
    const initialColumns: ColumnDef<ArticleForTableItem>[] = [
      {
        accessorKey: "title",
        header: "Назва",
        id: "Назва",
        enableHiding: false,
        cell({ getValue }) {
          const articleTitle = getValue<string>();

          return <p className="text-base ">{articleTitle}</p>;
        },
      },
      {
        accessorKey: "author",
        header: "Автор",
        id: "Автор",
        enableHiding: false,
        cell({ getValue }) {
          const author = getValue<ArticleForTableItem["author"]>();

          return (
            <div>
              <p className="text-base ">
                {author.name} {author.id === user?.id ? "(Ви)" : ""}
              </p>
              <UserRole role={author.role} />
            </div>
          );
        },
      },
      {
        accessorKey: "tags",
        header: "Теги",
        id: "Теги",
        cell({ getValue }) {
          const tags = getValue<ArticleForTableItem["tags"]>();

          return (
            <div>
              {tags.map((tag) => {
                return (
                  <Badge key={tag.id} className="mr-2">
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Дата створення",
        id: "Дата створення",
        maxSize: 100,
        cell({ getValue }) {
          const createdAt = getValue<ArticleForTableItem["createdAt"]>();

          return <p className="text-base ">{formatDate(createdAt)}</p>;
        },
      },
      {
        accessorKey: "id",
        header: "",
        enableHiding: false,
        minSize: 64,
        maxSize: 64,
        size: 64,
        cell: ({ getValue }) => {
          const _articleId = getValue<string>();

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
                  <DropdownMenuItem>Відкрити</DropdownMenuItem>
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Редагувати</DropdownMenuItem>
                    <DropdownMenuItem>Видалити</DropdownMenuItem>
                  </>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];

    if (permissions.canViewOnlyOwnArticles) {
      return initialColumns.filter((column) => {
        return column.id !== "Автор";
      });
    }

    return initialColumns;
  }, [permissions.canViewOnlyOwnArticles, user?.id]);

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
          Ще нічого не опубліковано
        </h3>
        <h3 className="text-center text-base">Будьте першими!</h3>
        <Button className="mt-3" variant="default" asChild>
          <Link href="/create-article">Написати статтю</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="container mb-6 flex items-end justify-between">
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
                    disabled={column.getCanHide()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                      "pl-7": index === 0,
                    })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={cn({
                      "pl-7": index === 0,
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
                На жаль, не було знайдено потрібних статтей. Спробуйте інший
                запит
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
  );
};

export default memo(ArticlesTable);
