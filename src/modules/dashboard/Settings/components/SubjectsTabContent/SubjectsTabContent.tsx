import { memo, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useReactTable, type ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import type { Discipline } from '@prisma/client';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { useToggle } from '@/hooks/useToggle';
import { api } from '@/utils/api';
import { cn } from '@/utils/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import CreateSubjectDialog from './components/CreateSubjectDialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import SubjectsTableSkeleton from './components/SubjectsTableSkeleton';
import ToggledMarkdown from './components/ToggledMarkdown';

const RemoveSubjectDialog = dynamic(() => {
    return import('./components/RemoveSubjectDialog');
});
const UpdateSubjectDialog = dynamic(() => {
    return import('./components/UpdateSubjectDialog');
});
const ButchRemoveSubjectsDialog = dynamic(() => {
    return import('./components/ButchRemoveSubjectsDialog');
});

const SubjectsTabContent: React.FC = () => {
    const [searchValue, debouncedSearchValue, setSearchValue] = useDebouncedState('');
    const [isCreateSubjectDialogOpen, , setCreateSubjectDialogOpen] = useToggle();
    const [isRemoveSubjectDialogOpen, , setRemoveSubjectDialogOpen] = useToggle();
    const [isButchRemoveSubjectsDialogOpen, , setButchRemoveSubjectsDialogOpen] = useToggle();
    const [isUpdateSubjectDialogOpen, , setUpdateSubjectDialogOpen] = useToggle();
    const [rowSelection, setRowSelection] = useState({});

    const {
        data: subjectResponse,
        isLoading: isSubjectsLoading,
        isRefetching: isSubjectsRefetching,
    } = api.subjects.getAllSubjects.useQuery({
        search: debouncedSearchValue.trim(),
    });

    const isEmpty = !debouncedSearchValue.trim() && !subjectResponse?.length;
    const isLoading = isSubjectsLoading && !isSubjectsRefetching;

    const selectedSubjectsIds = useMemo(() => {
        return (
            subjectResponse
                ?.filter((_, index) => {
                    return rowSelection[index as keyof typeof rowSelection];
                })
                .map((subject) => {
                    return subject.id;
                }) ?? []
        );
    }, [rowSelection, subjectResponse]);

    console.log(selectedSubjectsIds);

    const isButchRemoveEnabled =
        selectedSubjectsIds.length > 1 && !isRemoveSubjectDialogOpen && !isUpdateSubjectDialogOpen;

    const columns = useMemo<ColumnDef<Discipline>[]>(() => {
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
                            className="mt-1"
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
                    const subjectName = getValue<Discipline['name']>();

                    return <p className="text-base">{subjectName}</p>;
                },
                enableHiding: false,
            },
            {
                accessorKey: 'description',
                header: 'Опис',
                id: 'Опис',
                cell({ getValue }) {
                    const subjectDescription = getValue<Discipline['description']>();

                    return <ToggledMarkdown className="max-w-[500px]">{subjectDescription}</ToggledMarkdown>;
                },
            },
            {
                accessorKey: 'credits',
                header: 'Кредити',
                id: 'Кредити',
                cell({ getValue }) {
                    const subjectCredits = getValue<Discipline['credits']>();

                    return <p className="text-base">{subjectCredits.toFixed(2)}</p>;
                },
            },
            {
                accessorKey: 'courses',
                header: 'Курси',
                id: 'Курси',
                cell({ getValue }) {
                    const subjectCourses = getValue<Discipline['courses']>();
                    const splittedCourses = subjectCourses.split(',');

                    return (
                        <div className="flex min-w-[150px] flex-wrap">
                            {splittedCourses.map((course) => {
                                return (
                                    <Badge className="mr-2 mt-2" key={course}>
                                        {course}
                                    </Badge>
                                );
                            })}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'id',
                header: '',
                enableHiding: false,
                minSize: 64,
                maxSize: 64,
                size: 64,
                cell({ row }) {
                    return (
                        <div className="flex w-full justify-end pr-4">
                            <DropdownMenu
                                onOpenChange={(opened) => {
                                    if (opened) {
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
                                            setUpdateSubjectDialogOpen(true);
                                        }}
                                    >
                                        Редагувати
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setRemoveSubjectDialogOpen(true);
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
    }, [setRemoveSubjectDialogOpen, setUpdateSubjectDialogOpen]);

    const table = useReactTable({
        data: subjectResponse ?? [],
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
                                placeholder="Введіть назву дисципліни"
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
                                    if (selectedSubjectsIds.length === 1) {
                                        setRemoveSubjectDialogOpen(true);
                                        return;
                                    }

                                    setButchRemoveSubjectsDialogOpen(true);
                                }}
                            >
                                Видалити вибрані
                            </Button>
                        ) : null}
                        <Button
                            className="ml-2"
                            onClick={() => {
                                setCreateSubjectDialogOpen(true);
                            }}
                        >
                            Додати дисципліну
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
                                Ще не було створено жодної дисципліни, почніть з додавання нової
                            </h3>
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div>
                                    <SubjectsTableSkeleton />
                                </div>
                            ) : (
                                <>
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
                                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                                        На жаль, не було знайдено потрібних дисциплін. Спробуйте інший
                                                        запит
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <CreateSubjectDialog open={isCreateSubjectDialogOpen} onOpenChange={setCreateSubjectDialogOpen} />
            <UpdateSubjectDialog
                open={isUpdateSubjectDialogOpen}
                onOpenChange={setUpdateSubjectDialogOpen}
                subjectId={selectedSubjectsIds[0] ?? ''}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <RemoveSubjectDialog
                open={isRemoveSubjectDialogOpen}
                onOpenChange={setRemoveSubjectDialogOpen}
                id={selectedSubjectsIds[0] ?? ''}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <ButchRemoveSubjectsDialog
                open={isButchRemoveSubjectsDialogOpen}
                onOpenChange={setButchRemoveSubjectsDialogOpen}
                ids={selectedSubjectsIds}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
        </>
    );
};

export default memo(SubjectsTabContent);