import { env } from "@/env.mjs";

export const LOCK_SCROLL_Y_CLASS_NAME = "lock-scroll-y";

export const APP_VERSION = "alpha.0.11.10";
export const IS_DEV = env.NEXT_PUBLIC_NODE_ENV === "development";
export const ERROR_CODE = {
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;

export const GOOGLE_AUTH_PARAMS = {
  prompt: "consent",
  access_type: "offline",
  response_type: "code",
};

export const USER_ROLES = {
  USER: "USER",
  AUTHOR: "AUTHOR",
  ADMIN: "ADMIN",
} as const;

export const EMPTY_AVATAR_URL = "/images/avatar-default.webp";
export const DEFAULT_USER_NAME = "Ім'я користувача";

export const AVATAR_MINI_SIZE = 32;
export const AVATAR_BASE_SIZE = 74;

export const ICON_S_SIZE = 12;
export const ICON_M_SIZE = 16;
export const ICON_L_SIZE = 20;

export const MOCK_ARTICLE_IMAGE =
  "https://images.pexels.com/photos/7233352/pexels-photo-7233352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
export const VNS_URL = "https://vns.lpnu.ua/";
export const STUDENTS_SCHEDULE_URL =
  "https://student.lpnu.ua/students_schedule";

export const PATHS = {
  MAIN: "/",
  PROFILE: "/profile",
  NEWS: "/news",
  COLLECTIVE: "/staff",
  ABOUT: "/about",
  ADMIN_PANEL: "/admin",
  CREATE_NEWS: "/news/create",
} as const;

export const ADMIN_PATHS = {
  PANEL: "/admin",
};
