import { memo, useMemo, useState } from 'react';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { useToggle } from '@/hooks/useToggle';
import { api } from '@/utils/api';
import { useReactTable, type ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table';
import type { LibraryPublication } from '@prisma/client';
// import { Checkbox } from '@/components/Checkbox';
import { cn, formatDate, shimmer, toBase64 } from '@/utils/common';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    // DropdownMenuItem,
    // DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/DropdownMenu';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { Button } from '@/components/Button';
import {
    ChevronDown,
    ExternalLinkIcon,
    // MoreHorizontal
} from 'lucide-react';
// import Link from 'next/link';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import Image from 'next/image';
import SubjectsTableSkeleton from '../SubjectsTabContent/components/SubjectsTableSkeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import CreateLibraryPublicationDialog from './components/CreateLibraryPublicationDialog';
import { Dialog, DialogContent, DialogTrigger } from '@/components/Dialog';
import { Badge } from '@/components/Badge';

const LibraryTabContent: React.FC = () => {
    const [searchValue, debouncedSearchValue, setSearchValue] = useDebouncedState('');
    const [isCreateLibraryPublicationDialogOpen, , setCreateLibraryPublicationDialogOpen] = useToggle();
    const [isRemoveLibraryPublicationDialogOpen, , setRemoveLibraryPublicationDialogOpen] = useToggle();
    const [_isButchRemoveLibraryPublicationsDialogOpen, , setButchRemoveLibraryPublicationsDialogOpen] = useToggle();
    const [isUpdateLibraryPublicationDialogOpen, , setUpdateLibraryPublicationDialogOpen] = useToggle();
    const [rowSelection, setRowSelection] = useState({});

    const {
        data: libraryPublicationsResponse = [],
        isLoading: isLibraryPublicationsLoading,
        isFetching: isLibraryPublicationsFetching,
    } = api.libraryPublication.getAllLibraryPublications.useQuery({
        search: debouncedSearchValue,
    });

    const isEmpty = !debouncedSearchValue.trim() && !libraryPublicationsResponse?.length;
    const isLoading = isLibraryPublicationsLoading && !isLibraryPublicationsFetching;

    const selectedLibraryPublicationsIds = useMemo(() => {
        return (
            libraryPublicationsResponse
                ?.filter((_, index) => {
                    return rowSelection[index as keyof typeof rowSelection];
                })
                .map((subject) => {
                    return subject.id;
                }) ?? []
        );
    }, [libraryPublicationsResponse, rowSelection]);

    const isButchRemoveEnabled =
        selectedLibraryPublicationsIds.length > 1 &&
        !isRemoveLibraryPublicationDialogOpen &&
        !isUpdateLibraryPublicationDialogOpen;

    const columns = useMemo<ColumnDef<LibraryPublication>[]>(() => {
        return [
            // {
            //     id: 'select',
            //     header({ table }) {
            //         return (
            //             <Checkbox
            //                 checked={table.getIsAllPageRowsSelected()}
            //                 onCheckedChange={(value) => {
            //                     table.toggleAllPageRowsSelected(!!value);
            //                 }}
            //                 aria-label="Select all"
            //             />
            //         );
            //     },
            //     cell({ row }) {
            //         return (
            //             <Checkbox
            //                 className="mt-1"
            //                 checked={row.getIsSelected()}
            //                 onCheckedChange={(value) => {
            //                     row.toggleSelected(!!value);
            //                 }}
            //                 aria-label="Select row"
            //             />
            //         );
            //     },
            //     enableHiding: false,
            // },
            {
                accessorKey: 'title',
                header: 'Назва',
                id: 'Назва',
                minSize: 450,
                maxSize: 550,
                enableHiding: false,
                cell({ getValue }) {
                    const title = getValue<LibraryPublication['title']>();

                    return <p className="min-w-[250px] max-w-[550px] text-base">{title}</p>;
                },
            },
            {
                accessorKey: 'publicator',
                header: 'Видааець',
                id: 'Видааець',
                maxSize: 200,
                cell({ getValue }) {
                    const publicator = getValue<LibraryPublication['publicator']>();

                    return <p className="text-base">{publicator}</p>;
                },
            },
            {
                accessorKey: 'posterUrl',
                header: 'Фото',
                id: 'Фото',
                cell({ row, getValue }) {
                    const title = row.original.title;
                    const image = getValue<LibraryPublication['posterUrl']>();

                    if (!image) {
                        return <p className="text-base">Немає</p>;
                    }

                    return (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="h-6 p-0">
                                    Переглянути
                                    <ExternalLinkIcon className="ml-1" size={16} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <div className="mt-6">
                                    <Image
                                        className="w-full rounded-lg"
                                        src={image}
                                        width={720}
                                        height={956}
                                        quality={80}
                                        unoptimized
                                        alt={title}
                                        placeholder="blur"
                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(720, 1280))}`}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    );
                },
            },
            {
                accessorKey: 'authors',
                header: 'Автори',
                id: 'Автори',
                maxSize: 400,
                cell({ getValue }) {
                    const authors = getValue<LibraryPublication['authors']>();

                    if (!authors.split(',').length) {
                        return <p className="text-base text-muted-foreground">Немає</p>;
                    }

                    return (
                        <div className="flex flex-wrap">
                            {authors.split(',').map((author) => {
                                return (
                                    <Badge key={author} className="mb-2 mr-2">
                                        {author}
                                    </Badge>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Дата додавання',
                id: 'Дата додавання',
                maxSize: 100,
                cell({ getValue }) {
                    const createdAt = getValue<LibraryPublication['createdAt']>();

                    return <p className="whitespace-nowrap text-base">{formatDate(createdAt)}</p>;
                },
            },
            {
                accessorKey: 'id',
                header: '',
                enableHiding: false,
                minSize: 64,
                maxSize: 64,
                size: 64,
                cell: '',
                // cell({ row, table }) {
                //     return (
                //         <div className="flex w-full justify-end pr-4">
                //             <DropdownMenu
                //                 onOpenChange={(opened) => {
                //                     if (opened) {
                //                         table.toggleAllPageRowsSelected(false);
                //                         row.toggleSelected(opened);
                //                     }
                //                 }}
                //             >
                //                 <TooltipProvider>
                //                     <Tooltip>
                //                         <TooltipTrigger asChild>
                //                             <DropdownMenuTrigger asChild>
                //                                 <Button variant="ghost" className="h-8 w-8 p-0">
                //                                     <span className="sr-only">Відкрити меню</span>
                //                                     <MoreHorizontal className="h-4 w-4" />
                //                                 </Button>
                //                             </DropdownMenuTrigger>
                //                         </TooltipTrigger>
                //                         <TooltipContent>
                //                             <p>Додаткові дії</p>
                //                         </TooltipContent>
                //                     </Tooltip>
                //                 </TooltipProvider>
                //                 <DropdownMenuContent align="end">
                //                     <DropdownMenuLabel>Дії</DropdownMenuLabel>
                //                     <Link href={`/subjects/${row.original.id}`} target="_blank">
                //                         <DropdownMenuItem>Відкрити</DropdownMenuItem>
                //                     </Link>
                //                     <DropdownMenuItem
                //                         onClick={() => {
                //                             setUpdateLibraryPublicationDialogOpen(true);
                //                         }}
                //                     >
                //                         Редагувати
                //                     </DropdownMenuItem>
                //                     <DropdownMenuItem
                //                         onClick={() => {
                //                             setRemoveLibraryPublicationDialogOpen(true);
                //                         }}
                //                     >
                //                         Видалити
                //                     </DropdownMenuItem>
                //                 </DropdownMenuContent>
                //             </DropdownMenu>
                //         </div>
                //     );
                // },
            },
        ];
    }, [setRemoveLibraryPublicationDialogOpen, setUpdateLibraryPublicationDialogOpen]);

    const table = useReactTable({
        data: libraryPublicationsResponse,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    });

    return (
        <>
            <div>
                <div className=" container mb-6 flex items-end justify-between">
                    <div className="flex items-end">
                        <div className="w-[24.0625rem]">
                            <Label htmlFor="search">Пошук</Label>
                            <Input
                                type="search"
                                id="search"
                                placeholder="Введіть назву публікації"
                                disabled={isEmpty}
                                value={searchValue}
                                onChange={(event) => {
                                    setSearchValue(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        {isButchRemoveEnabled ? (
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (selectedLibraryPublicationsIds.length === 1) {
                                        setRemoveLibraryPublicationDialogOpen(true);
                                        return;
                                    }

                                    setButchRemoveLibraryPublicationsDialogOpen(true);
                                }}
                            >
                                Видалити вибрані
                            </Button>
                        ) : null}
                        <Button
                            className="ml-2"
                            onClick={() => {
                                setCreateLibraryPublicationDialogOpen(true);
                            }}
                        >
                            Додати публікацію
                        </Button>
                    </div>
                </div>
                <div>
                    {!isLoading && isEmpty ? (
                        <div className="container my-16 flex w-full flex-col items-center">
                            <Image
                                className="dark:rounded-2xl dark:bg-foreground dark:py-5"
                                src="/images/empty.png"
                                width={316}
                                height={202}
                                alt="Ще нічого не опубліковано"
                            />
                            <h3 className="mt-3 text-center text-base">
                                Ще не було створено жодної публікації, почніть з додавання нової
                            </h3>
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div>
                                    <SubjectsTableSkeleton />
                                </div>
                            ) : (
                                <div>
                                    <div className=" container flex justify-end">
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
                                    <div className="max-w-full overflow-x-auto">
                                        <Table className="w-full">
                                            <TableHeader className="sticky top-0 bg-background">
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
                                                                        : flexRender(
                                                                              header.column.columnDef.header,
                                                                              header.getContext()
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
                                                            className="cursor-pointer"
                                                            key={row.id}
                                                            data-state={row.getIsSelected() && 'selected'}
                                                        >
                                                            {row.getVisibleCells().map((cell, index) => (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    className={cn('align-top', {
                                                                        'pl-7': index === 0,
                                                                    })}
                                                                >
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={columns.length}
                                                            className="h-24 text-center"
                                                        >
                                                            На жаль, не було знайдено потрібних публікацій. Спробуйте
                                                            інший запит
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <CreateLibraryPublicationDialog
                open={isCreateLibraryPublicationDialogOpen}
                onOpenChange={setCreateLibraryPublicationDialogOpen}
            />
            {/* <UpdateSubjectDialog
                open={isUpdateLibraryPublicationDialogOpen}
                onOpenChange={setUpdateLibraryPublicationDialogOpen}
                subjectId={selectedLIbraryPublicationsIds[0] ?? ''}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <RemoveSubjectDialog
                open={isRemoveLibraryPublicationDialogOpen}
                onOpenChange={setRemoveLibraryPublicationDialogOpen}
                id={selectedLIbraryPublicationsIds[0] ?? ''}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <ButchRemoveSubjectsDialog
                open={isButchRemoveLibraryPublicationsDialogOpen}
                onOpenChange={setButchRemoveLibraryPublicationsDialogOpen}
                ids={selectedLIbraryPublicationsIds}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            /> */}
        </>
    );
};

export default memo(LibraryTabContent);
