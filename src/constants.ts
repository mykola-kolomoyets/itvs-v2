import type { AcademicStatus } from '@prisma/client';
import type { Option } from '@/types';
import { env } from '@/env.mjs';

export const LOCK_SCROLL_Y_CLASS_NAME = 'lock-scroll-y';

export const APP_VERSION = 'alpha.0.11.10';
export const IS_DEV = env.NEXT_PUBLIC_NODE_ENV === 'development';
export const ERROR_CODE = {
    UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export const GOOGLE_AUTH_PARAMS = {
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
};

export const USER_ROLES = {
    USER: 'USER',
    AUTHOR: 'AUTHOR',
    ADMIN: 'ADMIN',
} as const;

export const EMPTY_AVATAR_URL = '/images/avatar-default.webp';
export const DEFAULT_USER_NAME = "Ім'я користувача";

export const DEFAULT_POSTER_URL = 'https://lpnu.ua/sites/default/files/2023/7/18/news/24194/itvs-prog-t.jpg';
export const APP_HOSTNAME = ' https://itvs-v2-dev.vercel.app';

export const AVATAR_MINI_SIZE = 32;
export const AVATAR_BASE_SIZE = 74;

export const ICON_S_SIZE = 12;
export const ICON_M_SIZE = 16;
export const ICON_L_SIZE = 20;

export const MOCK_ARTICLE_IMAGE =
    'https://images.pexels.com/photos/7233352/pexels-photo-7233352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
export const VNS_URL = 'https://vns.lpnu.ua/';
export const STUDENTS_SCHEDULE_URL = 'https://student.lpnu.ua/students_schedule';

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
        description: 'Всі дисципліни кафедри по семестрам',
    },
    {
        title: 'Наукова робота',
        href: '/science',
        description: 'Викладацькі та студентські наукові роботи',
    },
    {
        title: 'Бібліотека',
        href: '/publications',
        description: 'Портфоліо опублікованих матеріалів кафедри',
    },
];

export const DISCIPLINE_SEMESTERS_OPTIONS: Record<string, Option[]> = {
    Бакалаврат: [
        {
            label: '1',
            value: '1',
        },
        {
            label: '2',
            value: '2',
        },
        {
            label: '3',
            value: '3',
        },
        {
            label: '4',
            value: '4',
        },
        {
            label: '5',
            value: '5',
        },
        {
            label: '6',
            value: '6',
        },
        {
            label: '7',
            value: '7',
        },
        {
            label: '8',
            value: '8',
        },
    ],
    Магістатура: [
        {
            label: '9',
            value: '9',
        },
        {
            label: '10',
            value: '10',
        },
    ],
};

export const EMPLOYEE_ACADEMIC_STATUSES: Record<AcademicStatus, { label: string; id: string; priority: number }> = {
    head_engineer: {
        label: 'Провідний інженер',
        id: 'head_engineer',
        priority: 1,
    },
    assistant: {
        label: 'Асистент кафедри',
        id: 'assistant',
        priority: 2,
    },
    assistant_ktn: {
        label: 'Асистент кафедри, к.т.н.',
        id: 'assistant_ktn',
        priority: 3,
    },
    senior_lecturer: {
        label: 'Старший викладач кафедри, к.т.н.',
        id: 'senior_lecturer',
        priority: 4,
    },
    docent: {
        label: 'Доцент кафедри, к.т.н.',
        id: 'docent',
        priority: 5,
    },
    docent_math_phys: {
        label: 'к.ф.-м.н, доцент',
        id: 'docent_math_phys',
        priority: 5,
    },
    doctor_math_phys_master: {
        label: 'д.ф.-м.н., ст.н.с.',
        id: 'doctor_math_phys_master',
        priority: 5,
    },
    professor: {
        label: 'Професор кафедри, д.т.н.',
        id: 'professor',
        priority: 8,
    },
    sub_director: {
        label: 'В.О. Завідувач кафедри, д.т.н.',
        id: 'sub_director',
        priority: 9,
    },
    director: {
        label: 'Завідувач кафедри, д.т.н.',
        id: 'director',
        priority: 10,
    },
    director_ktn: {
        label: 'Завідувач кафедри, к.т.н.',
        id: 'director_ktn',
        priority: 11,
    },
};
