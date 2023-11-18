import { useCallback, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckIcon,
  ExternalLinkIcon,
  ListFilterIcon,
  Loader2,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Role } from "@prisma/client";
import type { UserForTableItem } from "@/types";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { useMePermissions } from "@/hooks/useMePermissions";
import { useToggle } from "@/hooks/useToggle";
import { useToast } from "@/components/Toaster/hooks/useToast";
import {
  clickOnLink,
  cn,
  copyToClipboard,
  getFirstLetters,
} from "@/utils/common";
import { api } from "@/utils/api";
import { USER_ROLE_LABELS } from "@/components/UserRole/constants";
import { USERS_LIMIT, USER_ROLES_OPTIONS } from "./constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChangeUserRoleDialog from "./components/ChangeUserRoleDialog";
import UsersFilterSkeleton from "./components/UsersFilterSkeleton";
import UsersTableSkeleton from "./components/UsersTableSkeleton";
import Pagination from "@/components/Pagination";
import UserRole from "@/components/UserRole";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ContextMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";

const UsersModule: React.FC = () => {
  const { user, permissions } = useMePermissions();

  const [page, setPage] = useState(1);
  const [searchValue, debouncedSearchValue, setSearchValue] =
    useDebouncedState("");
  const [isChangeRoleDialogOpen, , setIsChangeRoleDialogOpen] = useToggle();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [selectedFilterRoles, setSelectedFilterRoles] = useState<Role[]>([]);

  const { toast } = useToast();

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isRefetching: isUsersRefetching,
  } = api.users.getAllUsers.useInfiniteQuery(
    {
      search: debouncedSearchValue.trim(),
      roles: selectedFilterRoles,
      limit: USERS_LIMIT,
      skip: (page - 1) * USERS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
      enabled:
        !debouncedSearchValue.trim().length ||
        (!!debouncedSearchValue.length &&
          debouncedSearchValue.trim().length > 2),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  const currentPage = usersResponse?.pages[0];
  const isLoading = isUsersLoading && !isUsersRefetching;

  const currentPageUsers = useMemo(() => {
    return currentPage?.users ?? [];
  }, [currentPage?.users]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId) {
      return undefined;
    }

    return currentPageUsers.find((user) => {
      return user.id === selectedUserId;
    });
  }, [currentPageUsers, selectedUserId]);

  const toggleRolesFilterHandler = useCallback(
    (value: Role) => {
      if (selectedFilterRoles.includes(value)) {
        setSelectedFilterRoles((prev) => {
          return prev.filter((role) => {
            return role !== value;
          });
        });

        return;
      }

      setSelectedFilterRoles((prev) => {
        return [...prev, value];
      });
    },
    [selectedFilterRoles],
  );

  const sendEmailHandler = useCallback((email: string) => {
    clickOnLink(`mailto:${email}`);
  }, []);

  const copyToClipboardHandler = useCallback(
    async (value: string) => {
      await copyToClipboard(
        value,
        () => {
          toast({
            title: "Пошта скопійована",
            description: `Пошта ${value} скопійована в буфер обміну`,
          });
        },
        () => {
          toast({
            title: "Пошта  не була скопійована",
            description:
              "Виникла помилка під час копіювання пошти. Спробуйте ще раз пізніше, або скопіюйте вручну за допомогою клавіш Ctrl+C",
            variant: "destructive",
          });
        },
      );
    },
    [toast],
  );

  const columns = useMemo<ColumnDef<UserForTableItem>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Імʼя",
        enableHiding: false,
        cell({ row, getValue }) {
          const name = getValue<string>();
          const userAvatarImage = row.original.image;

          return (
            <div className="flex items-center">
              <Avatar className="mr-2">
                <AvatarImage
                  src={userAvatarImage ?? ""}
                  alt={name ?? "No Name"}
                />
                <AvatarFallback>{getFirstLetters(name ?? "")}</AvatarFallback>
              </Avatar>
              <p className="text-base">
                {name} {row.original.id === user?.id ? "(Ви)" : ""}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Пошта",
        cell({ getValue }) {
          const email = getValue<string>();

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
                      <p>
                        Натисніть щоб написати листа, або правий клік для
                        додаткових дій
                      </p>
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
      },
      {
        accessorKey: "role",
        header: "Роль",
        cell({ getValue }) {
          const role = getValue<Role>();

          return <UserRole role={role} />;
        },
      },
      {
        accessorKey: "id",
        header: "",
        enableHiding: false,
        minSize: 64,
        maxSize: 64,
        size: 64,
        cell: ({ row }) => {
          const { id } = row.original;

          if (id === user?.id || !permissions.canChangeAnyUserRole) {
            return null;
          }

          return (
            <div className="flex w-full justify-end pr-4">
              <DropdownMenu modal>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Додаткові дії"
                        >
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
                      setSelectedUserId(id);
                      setIsChangeRoleDialogOpen(true);
                    }}
                  >
                    Змінити роль
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [
    user?.id,
    copyToClipboardHandler,
    sendEmailHandler,
    permissions.canChangeAnyUserRole,
    setIsChangeRoleDialogOpen,
  ]);
  const table = useReactTable({
    data: currentPageUsers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <DashboardLayout>
        <section className="border-b border-solid border-border pb-4 pt-[18px]">
          <div className=" container flex items-start justify-between">
            <h1 className="mb-[1.125rem] text-3xl font-semibold">
              Користувачі
            </h1>
          </div>
          <div className="container flex items-end">
            {isLoading ? (
              <UsersFilterSkeleton />
            ) : (
              <>
                <div className="w-[24.0625rem]">
                  <Label htmlFor="search">Пошук</Label>
                  <Input
                    type="search"
                    id="search"
                    placeholder="Введіть імʼя або пошту"
                    value={searchValue}
                    onChange={(event) => {
                      setSearchValue(event.target.value);
                    }}
                  />
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="ml-3"
                        variant="ghost"
                        size="icon"
                        title="Фільтр"
                      >
                        <ListFilterIcon size={20} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <h6 className="mb-1 ml-4 text-sm">Ролі</h6>
                      <div className="flex flex-col">
                        {Object.values(USER_ROLES_OPTIONS).map((option) => {
                          return (
                            <Button
                              key={option.value}
                              className="justify-between"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toggleRolesFilterHandler(option.value as Role);
                              }}
                            >
                              <UserRole role={option.value as Role} />
                              {selectedFilterRoles.includes(
                                option.value as Role,
                              ) ? (
                                <CheckIcon size={16} />
                              ) : null}
                            </Button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {isUsersRefetching ? (
                  <div className="ml-4 py-3">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div className="container flex items-center">
            {selectedFilterRoles.length ? (
              <div className="mt-3 flex items-center">
                <p className="mr-2 text-base">Ролі:</p>
                {selectedFilterRoles.map((role) => {
                  return (
                    <Badge
                      key={role}
                      className="mr-1"
                      title={USER_ROLE_LABELS[role]}
                      variant="secondary"
                      onClick={() => {
                        toggleRolesFilterHandler(role);
                      }}
                    >
                      {USER_ROLE_LABELS[role]}
                    </Badge>
                  );
                })}

                <Button
                  className="ml-2"
                  variant="ghost"
                  size={"sm"}
                  onClick={() => {
                    setSelectedFilterRoles([]);
                  }}
                >
                  <RotateCcw className="mr-1" size={16} />
                  Очистити всі
                </Button>
              </div>
            ) : null}
          </div>
        </section>
        <div className="my-6">
          {isLoading ? (
            <UsersTableSkeleton />
          ) : (
            <>
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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
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
                        На жаль, не було знайдено потрібних користувачів.
                        Спробуйте інший запит
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {currentPageUsers?.length ? (
                <Pagination
                  className="container"
                  count={currentPage?.total ?? 0}
                  page={page}
                  limit={USERS_LIMIT}
                  onPageChange={(newPage) => {
                    setPage(newPage ?? 1);
                  }}
                />
              ) : null}
            </>
          )}
        </div>
      </DashboardLayout>
      <ChangeUserRoleDialog
        user={selectedUser}
        open={isChangeRoleDialogOpen}
        onOpenChange={setIsChangeRoleDialogOpen}
      />
    </>
  );
};

export default UsersModule;
