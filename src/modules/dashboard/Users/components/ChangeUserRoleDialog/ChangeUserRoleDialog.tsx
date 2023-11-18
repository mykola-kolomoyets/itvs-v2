import { memo, useState } from "react";
import type { ChangeUserRoleDialogProps } from "./types";
import { api } from "@/utils/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { USER_ROLES_OPTIONS } from "../../constants";
import { USER_ROLE_LABELS } from "@/components/UserRole/constants";
import { Loader2 } from "lucide-react";
import type { Role } from "@prisma/client";
import { getFirstLetters } from "@/utils/common";
import UserRole from "@/components/UserRole";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toaster/hooks/useToast";

const ChangeUserRoleDialog: React.FC<ChangeUserRoleDialogProps> = ({
  user,
  ...rest
}) => {
  const utils = api.useUtils();

  const [selectedUserRole, setSelectedUserRole] = useState<Role>(() => {
    return user?.role ?? "USER";
  });

  const { mutateAsync: updateUserRole, isLoading: isUserRoleUpdating } =
    api.users.updateUserRole.useMutation({
      async onSuccess() {
        await utils.users.getAllUsers.invalidate();
      },
    });

  const { toast } = useToast();

  return (
    <Dialog {...rest}>
      <DialogContent className="w-[90vw] max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Змінити роль користувача</DialogTitle>
          <DialogDescription>
            Змініть праа доступів користувача, щоб дати йому можливість
            користуватися, або заборонити доступ до певних функцій
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center">
            <Avatar className="mr-2">
              <AvatarImage
                src={user?.image ?? ""}
                alt={user?.name ?? "No Name"}
              />
              <AvatarFallback>
                {getFirstLetters(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-stretch">
              <p className="text-base font-medium">
                {user?.name}{" "}
                <span className="text-sm text-muted-foreground">
                  ({user?.email})
                </span>
              </p>
              <UserRole role={user?.role ?? "USER"} />
            </div>
          </div>
          <div className="mt-7">
            <Select
              defaultValue={selectedUserRole}
              disabled={isUserRoleUpdating}
              onValueChange={(newValue) => {
                setSelectedUserRole(newValue as Role);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(USER_ROLES_OPTIONS).map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="mt-2"
              variant="secondary"
              disabled={isUserRoleUpdating}
            >
              Відмінити
            </Button>
          </DialogClose>
          <Button
            className="ml-2 mt-2"
            variant="default"
            disabled={isUserRoleUpdating}
            onClick={async () => {
              await updateUserRole({
                id: user!.id,
                role: selectedUserRole,
              });

              rest.onOpenChange?.(false);

              toast({
                title: "Роль користувача оновлено",
                description: (
                  <p>
                    Роль <span className="font-medium">{user?.name}</span> до{" "}
                    <span className="font-medium">
                      {USER_ROLE_LABELS[selectedUserRole]}
                    </span>{" "}
                    успішно оновлено
                  </p>
                ),
              });
            }}
          >
            {isUserRoleUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Оновити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ChangeUserRoleDialog);
