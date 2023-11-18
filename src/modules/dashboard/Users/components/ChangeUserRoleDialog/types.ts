import type { UserForTableItem, WithClassName } from "@/types";
import type { DialogProps } from "@radix-ui/react-dialog";

export type ChangeUserRoleDialogProps = WithClassName<{
  user?: UserForTableItem;
}> &
  DialogProps;
