import type { HeaderNavigationOption } from "./types";

export const HEADER_CREATE_OPTIONS: HeaderNavigationOption[] = [
  {
    title: "Статтю",
    href: "/create-article",
    description:
      "Звичайний пост, який відображає активності кафедри, інституту, політехніки",
  },
  {
    title: "Публікацію",
    href: "/create-article?science=true",
    description: "Наукова робота студентів та викладачів",
  },
];

export const HEADER_SETTINGS_OPTIONS: HeaderNavigationOption[] = [
  {
    title: "Новини",
    href: "/dashboard/settings?tab=news",
    description: "Налаштування всіх новин та їх атрибутів",
  },
  {
    title: "Колектив кафедри",
    href: "/dashboard/settings?tab=staff",
    description: "Налаштування всіх викладачів кафедри",
  },
  {
    title: "Дисципліни",
    href: "/dashboard/settings?tab=subjects",
    description: "Налаштування всіх дисциплін кафедри",
  },
  {
    title: "Теги",
    href: "/dashboard/settings?tab=tags",
    description: "Налаштування всіх новинних тегів",
  },
];
