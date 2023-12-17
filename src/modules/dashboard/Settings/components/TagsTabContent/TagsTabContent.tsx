import { memo, useMemo, useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { Tag } from '@prisma/client';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { api } from '@/utils/api';
import { cn } from '@/utils/common';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Button } from '@/components/Button';
import { useToggle } from '@/hooks/useToggle';
import { Skeleton } from '@/components/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { Checkbox } from '@/components/Checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import dynamic from 'next/dynamic';

const RemoveTagDialog = dynamic(() => {
    return import('./components/RemoveTagDialog');
});
const UpdateTagDialog = dynamic(() => {
    return import('./components/UpdateTagDialog');
});
const CreateTagDialog = dynamic(() => {
    return import('./components/CreateTagDialog');
});
const ButchRemoveTagsDialog = dynamic(() => {
    return import('./components/ButchRemoveTagsDialog');
});

const TagsTabContent: React.FC = () => {
    const [searchValue, debouncedSearchValue, setSearchValue] = useDebouncedState('');
    const [isCreateTagDialogOpen, , setCreateTagDialogOpen] = useToggle();
    const [isRemoveTagDialogOpen, , setRemoveTagDialogOpen] = useToggle();
    const [isButchRemoveTagsDialogOpen, , setButchRemoveTagsDialogOpen] = useToggle();
    const [isUpdateTagDialogOpen, , setUpdateTagDialogOpen] = useToggle();
    const [rowSelection, setRowSelection] = useState({});

    const {
        data: tagsResponse,
        isLoading: isAllTagsLoading,
        isRefetching: isAllTagsRefetching,
    } = api.tags.getAllTags.useQuery({
        search: debouncedSearchValue.trim(),
    });

    const isEmpty = !debouncedSearchValue.trim() && !tagsResponse?.length;
    const isLoading = isAllTagsLoading && !isAllTagsRefetching;

    const selectedTagsIds = useMemo(() => {
        return (
            tagsResponse
                ?.filter((_, index) => {
                    return rowSelection[index as keyof typeof rowSelection];
                })
                .map((tag) => {
                    return tag.id;
                }) ?? []
        );
    }, [rowSelection, tagsResponse]);

    const isButchRemoveEnabled = selectedTagsIds.length > 1 && !isRemoveTagDialogOpen && !isUpdateTagDialogOpen;

    const columns = useMemo<ColumnDef<Tag>[]>(() => {
        return [
            {
                id: 'select',
                header({ table }) {
                    return (
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => {
                                table.toggleAllPageRowsSelected(!!value);
                            }}
                            aria-label="Select all"
                        />
                    );
                },
                cell({ row }) {
                    return (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => {
                                row.toggleSelected(!!value);
                            }}
                            aria-label="Select row"
                        />
                    );
                },
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: 'Назва',
                cell({ getValue }) {
                    const tagName = getValue<Tag['name']>();

                    return <p className="text-base">{tagName}</p>;
                },
            },
            {
                accessorKey: 'id',
                header: '',
                enableHiding: false,
                minSize: 64,
                maxSize: 64,
                size: 64,
                cell({ row, table }) {
                    return (
                        <div className="flex w-full justify-end pr-4">
                            <DropdownMenu
                                onOpenChange={(opened) => {
                                    if (opened) {
                                        table.toggleAllPageRowsSelected(false);
                                        row.toggleSelected(opened);
                                    }
                                }}
                            >
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
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setUpdateTagDialogOpen(true);
                                        }}
                                    >
                                        Редагувати
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setRemoveTagDialogOpen(true);
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
    }, [setRemoveTagDialogOpen, setUpdateTagDialogOpen]);

    const table = useReactTable({
        data: tagsResponse ?? [],
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
                <div className="container mb-6 flex items-end justify-between">
                    <div className="flex items-end">
                        <div className="w-[24.0625rem]">
                            <Label htmlFor="search">Пошук</Label>
                            <Input
                                type="search"
                                id="search"
                                placeholder="Введіть назву тегу"
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
                                    if (selectedTagsIds.length === 1) {
                                        setRemoveTagDialogOpen(true);
                                        return;
                                    }

                                    setButchRemoveTagsDialogOpen(true);
                                }}
                            >
                                Видалити вибрані
                            </Button>
                        ) : null}
                        <Button
                            className="ml-2"
                            onClick={() => {
                                setCreateTagDialogOpen(true);
                            }}
                        >
                            Додати тег
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
                                Ще не було створено жодного тегу, почніть з додавання нового
                            </h3>
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div className="grid">
                                    <Skeleton />
                                </div>
                            ) : (
                                <div className="max-w-full overflow-x-auto">
                                    <Table className="relative">
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
                                                                className={cn({
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
                                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                                        На жаль, не було знайдено потрібних тегів. Спробуйте інший запит
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <CreateTagDialog open={isCreateTagDialogOpen} onOpenChange={setCreateTagDialogOpen} />
            <RemoveTagDialog
                open={isRemoveTagDialogOpen}
                onOpenChange={(opened) => {
                    setRemoveTagDialogOpen(opened);
                }}
                id={selectedTagsIds[0] ?? ''}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <UpdateTagDialog
                open={isUpdateTagDialogOpen}
                onOpenChange={(opened) => {
                    setUpdateTagDialogOpen(opened);
                }}
                id={selectedTagsIds[0] ?? ''}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <ButchRemoveTagsDialog
                open={isButchRemoveTagsDialogOpen}
                onOpenChange={setButchRemoveTagsDialogOpen}
                ids={selectedTagsIds}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
        </>
    );
};

export default memo(TagsTabContent);
