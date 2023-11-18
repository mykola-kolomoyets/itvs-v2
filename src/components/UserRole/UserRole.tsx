import { cn } from "@/utils/common";
import type { UserRoleProps } from "./types";
import { USER_ROLE_ICONS, USER_ROLE_LABELS } from "./constants";
import { memo } from "react";

const UserRole: React.FC<UserRoleProps> = ({ className, role }) => {
  const UserIcon = USER_ROLE_ICONS[role];
  return (
    <div className={cn("flex items-center", className)}>
      <UserIcon size={16} />
      <p className="ml-1 text-sm text-muted-foreground">
        {USER_ROLE_LABELS[role]}
      </p>
    </div>
  );
};

export default memo(UserRole);
