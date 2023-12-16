import type { HeaderNavigationOption } from '@/types';

export const HEADER_DEPARTMENT_OPTIONS: HeaderNavigationOption[] = [
    {
        title: 'Про Нас',
        href: '/about',
        description: 'Історія кафедри, її завдання та цілі',
    },
    {
        title: 'Колектив',
        href: '/staff',
        description: 'Викладацький склад кафедри, їх контакти',
    },
    {
        title: 'Новини',
        href: '/articles',
        description: 'Активності, оголошення кафедри та факультету',
    },
    {
        title: 'Звʼязатися з нами',
        href: '/contacts',
        description: 'Наші координати, телефони та адреса',
    },
];

export const HEADER_STUDY_OPTIONS: HeaderNavigationOption[] = [
    {
        title: 'Дисципліни',
        href: '/subjects',
        description: 'Всі дисципліни кафедри по курсам',
    },
    {
        title: 'Наукова робота',
        href: '/science',
        description: 'Викладацькі та студентські наукові роботи',
    },
    {
        title: 'Бібліотека',
        href: '/library',
        description: 'Портфоліо опублікованих матеріалів кафедри',
    },
];
