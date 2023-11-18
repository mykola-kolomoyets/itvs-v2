import { USER_ROLES } from "@/constants";
import { ShieldCheckIcon, PenLineIcon, UserIcon } from "lucide-react";

export const USER_ROLE_ICONS = {
  [USER_ROLES.ADMIN]: ShieldCheckIcon,
  [USER_ROLES.USER]: UserIcon,
  [USER_ROLES.AUTHOR]: PenLineIcon,
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.USER]: "Користувач",
  [USER_ROLES.AUTHOR]: "Автор",
  [USER_ROLES.ADMIN]: "Адміністратор",
} as const;
