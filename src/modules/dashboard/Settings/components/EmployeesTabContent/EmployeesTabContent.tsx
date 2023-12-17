import { memo, useCallback, useMemo, useState } from 'react';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { useToggle } from '@/hooks/useToggle';
import { api } from '@/utils/api';
import { useReactTable, type ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Checkbox } from '@/components/Checkbox';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ContextMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { ChevronDown, ExternalLinkIcon, MoreHorizontal } from 'lucide-react';
import { clickOnLink, cn, copyToClipboard, shimmer, toBase64 } from '@/utils/common';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';
import { Dialog, DialogContent } from '@/components/Dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import Image from 'next/image';
import { Badge } from '@/components/Badge';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table';
import EmployeesTableSkeleton from './components/EmployeesTableSkeleton';
import dynamic from 'next/dynamic';

const CreateEmployeeDialog = dynamic(() => {
    return import('./components/CreateEmployeeDialog');
});
const UpdateEmployeeDialog = dynamic(() => {
    return import('./components/UpdateEmployeeDialog');
});
const RemoveEmployeeDialog = dynamic(() => {
    return import('./components/RemoveEmployeeDialog');
});
const ButchRemoveEmployeesDialog = dynamic(() => {
    return import('./components/ButchRemoveEmployeesDialog');
});

const EmployeesTabContent: React.FC = () => {
    const [searchValue, debouncedSearchValue, setSearchValue] = useDebouncedState('');
    const [isCreateEmployeesDialogOpen, , setCreateEmployeesDialogOpen] = useToggle();
    const [isRemoveEmployeesDialogOpen, , setRemoveEmployeesDialogOpen] = useToggle();
    const [isButchRemoveEmployeesDialogOpen, , setButchRemoveEmployeesDialogOpen] = useToggle();
    const [isUpdateEmployeesDialogOpen, , setUpdateEmployeesDialogOpen] = useToggle();
    const [rowSelection, setRowSelection] = useState({});

    const { toast } = useToast();

    const {
        data: employeesResponse,
        isLoading: isEmployeesLoading,
        isRefetching: isEmployeesRefetching,
    } = api.employees.getAllEmployees.useQuery({
        search: debouncedSearchValue.trim(),
    });
    type EmployeeItem = NonNullable<typeof employeesResponse>[number];

    const isEmpty = !debouncedSearchValue.trim() && !employeesResponse?.length;
    const isLoading = isEmployeesLoading && !isEmployeesRefetching;

    const selectedEmployeesIds = useMemo(() => {
        return (
            employeesResponse
                ?.filter((_, index) => {
                    return rowSelection[index as keyof typeof rowSelection];
                })
                .map((employee) => {
                    return employee.id;
                }) ?? []
        );
    }, [employeesResponse, rowSelection]);

    const isButchRemoveEnabled =
        selectedEmployeesIds.length > 1 && !isRemoveEmployeesDialogOpen && !isUpdateEmployeesDialogOpen;

    const sendEmailHandler = useCallback((email: string) => {
        clickOnLink(`mailto:${email}`);
    }, []);

    const copyToClipboardHandler = useCallback(
        async (value: string) => {
            await copyToClipboard(
                value,
                () => {
                    toast({
                        title: 'Пошта скопійована',
                        description: `Пошта ${value} скопійована в буфер обміну`,
                    });
                },
                () => {
                    toast({
                        title: 'Пошта  не була скопійована',
                        description:
                            'Виникла помилка під час копіювання пошти. Спробуйте ще раз пізніше, або скопіюйте вручну за допомогою клавіш Ctrl+C',
                        variant: 'destructive',
                    });
                }
            );
        },
        [toast]
    );

    const columns = useMemo<ColumnDef<EmployeeItem>[]>(() => {
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
                header: 'ПІП',
                cell({ getValue }) {
                    const employeeName = getValue<EmployeeItem['name']>();

                    return (
                        <p className="max-w-[550px] truncate text-base" title={employeeName}>
                            {employeeName}
                        </p>
                    );
                },
                enableHiding: false,
            },
            {
                accessorKey: 'email',
                header: 'Пошта',
                cell({ getValue }) {
                    const email = getValue<EmployeeItem['email']>();

                    return (
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                className=" inline-flex items-center text-base hover:underline"
                                                href={`mailto:${email}`}
                                            >
                                                {email}
                                                <ExternalLinkIcon className="ml-1" size={16} />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Натисніть щоб написати листа, або правий клік для додаткових дій</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="mt-5 w-64">
                                <ContextMenuItem
                                    onClick={() => {
                                        void copyToClipboardHandler(email);
                                    }}
                                >
                                    Скопіювати пошту
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={() => {
                                        sendEmailHandler(email);
                                    }}
                                >
                                    Написати листа
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    );
                },
                enableHiding: false,
            },
            {
                accessorKey: 'academicStatus',
                header: 'Посада',
                id: 'Посада',
                cell({ getValue }) {
                    const academicStatus = getValue<EmployeeItem['academicStatus']>();

                    if (!academicStatus) {
                        return <p className="max-w-[550px] truncate text-base">Не вказано</p>;
                    }

                    const academicStatusLabel = EMPLOYEE_ACADEMIC_STATUSES[academicStatus].label;

                    return (
                        <p className="truncate text-base" title={academicStatusLabel}>
                            {academicStatusLabel}
                        </p>
                    );
                },
            },
            {
                accessorKey: 'image',
                header: 'Фото',
                id: 'Фото',
                cell({ row, getValue }) {
                    const employeeName = row.original.name;
                    const image = getValue<EmployeeItem['image']>();

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
                                        height={720}
                                        alt={employeeName}
                                        placeholder="blur"
                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(720, 720))}`}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    );
                },
            },
            {
                accessorKey: 'url',
                header: 'Wiki',
                id: 'Wiki',
                cell({ getValue }) {
                    const url = getValue<EmployeeItem['url']>();

                    if (!url) {
                        return <p className="text-base">Немає</p>;
                    }

                    return (
                        <a className=" inline-flex items-center text-base hover:underline" href={url} target="_blank">
                            Перейти
                            <ExternalLinkIcon className="ml-1" size={16} />
                        </a>
                    );
                },
            },
            {
                accessorKey: 'disciplines',
                header: 'Дисципліни',
                id: 'Дисципліни',
                cell({ getValue }) {
                    const disciplines = getValue<EmployeeItem['disciplines']>();

                    if (!disciplines?.length) {
                        return <p className="text-base text-muted-foreground">Немає</p>;
                    }

                    return (
                        <div className="-mt-1 flex flex-wrap">
                            {disciplines.map((discipline) => {
                                return (
                                    <Badge className="mr-1 mt-1" variant="secondary" key={discipline.id}>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>{discipline.abbreviation}</TooltipTrigger>
                                                <TooltipContent className="max-w-[300px]">
                                                    <p>{discipline.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
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
                                            setUpdateEmployeesDialogOpen(true);
                                        }}
                                    >
                                        Редагувати
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setRemoveEmployeesDialogOpen(true);
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
    }, [copyToClipboardHandler, sendEmailHandler, setRemoveEmployeesDialogOpen, setUpdateEmployeesDialogOpen]);

    const table = useReactTable({
        data: employeesResponse ?? [],
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
                                placeholder="Введіть ПІБ або пошту"
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
                                    if (selectedEmployeesIds.length === 1) {
                                        setRemoveEmployeesDialogOpen(true);
                                        return;
                                    }

                                    setButchRemoveEmployeesDialogOpen(true);
                                }}
                            >
                                Видалити вибрані
                            </Button>
                        ) : null}
                        <Button
                            className="ml-2"
                            onClick={() => {
                                setCreateEmployeesDialogOpen(true);
                            }}
                        >
                            Додати співробітника
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
                                Ще не було створено жодного співробітника, почніть з додавання нового
                            </h3>
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div>
                                    <EmployeesTableSkeleton />
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
                                                            className="group cursor-pointer"
                                                            key={row.id}
                                                            data-state={row.getIsSelected() && 'selected'}
                                                        >
                                                            {row.getVisibleCells().map((cell, index) => (
                                                                <TableCell
                                                                    key={cell.id}
                                                                    className={cn('relative', {
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
                                                            На жаль, не було знайдено потрібних співробітників.
                                                            Спробуйте інший запит
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <CreateEmployeeDialog open={isCreateEmployeesDialogOpen} onOpenChange={setCreateEmployeesDialogOpen} />
            <UpdateEmployeeDialog
                open={isUpdateEmployeesDialogOpen}
                employeeId={selectedEmployeesIds[0] ?? ''}
                onOpenChange={setUpdateEmployeesDialogOpen}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <RemoveEmployeeDialog
                open={isRemoveEmployeesDialogOpen}
                employeeId={selectedEmployeesIds[0] ?? ''}
                onOpenChange={setRemoveEmployeesDialogOpen}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
            <ButchRemoveEmployeesDialog
                open={isButchRemoveEmployeesDialogOpen}
                ids={selectedEmployeesIds}
                onOpenChange={setButchRemoveEmployeesDialogOpen}
                onSuccess={() => {
                    table.toggleAllPageRowsSelected(false);
                }}
            />
        </>
    );
};

export default memo(EmployeesTabContent);
