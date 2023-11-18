import type { WithClassName } from "@/types";
import type { Role } from "@prisma/client";

export type UserRoleProps = WithClassName<{
  role: Role;
}>;
