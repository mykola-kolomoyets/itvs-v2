import type { StaffConfigItem } from './types';
const KUSTRA: StaffConfigItem = {
    name: 'Кустра Наталія Омелянівна',
    position: 'Зав. кафедри к.т.н, доцент',
    url: '/images/staff/Кустра.jpg',
};
const RASHKEVYCH: StaffConfigItem = {
    name: 'Рашкевич Юрій Михайлович ',
    position: 'д.т.н, професор',
    url: '/images/staff/Рашкевич.jpeg',
};
const TKACHENKO: StaffConfigItem = {
    name: 'Ткаченко Роман Олексійович',
    position: 'д.т.н, професор',
    url: '/images/staff/Ткаченко.JPG',
};
const LOTOSHYNSKA: StaffConfigItem = {
    name: 'Лотошинська Наталія Дмитрівна',
    position: 'к.т.н, доцент',
    url: '/images/staff/Лотошинська.jpg',
};
const RIZNYK: StaffConfigItem = {
    name: 'Різник Олег Яремович',
    position: 'к.т.н, доцент',
    url: '/images/staff/Різник.jpg',
};
const HAVRYSH: StaffConfigItem = {
    name: 'Гавриш Богдана Михайлівна',
    position: 'к.т.н, доцент',
    url: '/images/staff/ГавришБ.jpg',
};
const MIYUSHKOVYCH: StaffConfigItem = {
    name: 'Міюшкович Юлія Георгіївна',
    position: 'к.т.н, доцент',
    url: '/images/staff/Міюшкович.jpg',
};
const MARCYSHYN: StaffConfigItem = {
    name: 'Марцишин Роман Степанович',
    position: 'к.т.н, доцент',
    url: '/images/staff/Марцишин.JPG',
};
const KOVALCHUK: StaffConfigItem = {
    name: 'Ковальчук Анатолій Михайлович',
    position: 'ст. викл',
    url: '/images/staff/Ковальчук.jpg',
};

export const STAFF_IMAGES_CONFIG: StaffConfigItem[] = [
    KOVALCHUK,
    MIYUSHKOVYCH,
    HAVRYSH,
    TKACHENKO,
    KUSTRA,
    RASHKEVYCH,
    LOTOSHYNSKA,
    MARCYSHYN,
    RIZNYK,
];

// export const STAFF_IMAGES_URLS_MOBILE = [
//     ['/images/staff/Ткаченко.jpg', '/images/staff/Кустра.jpg', '/images/staff/Лотошинська.jpg'],
//     ['/images/staff/Ковальчук.jpg', '/images/staff/Міюшкович.jpg', '/images/staff/ГавришБ.jpg'],
//     ['/images/staff/Марцишин.jpg', '/images/staff/Різник.jpg', '/images/staff/Рашкевич.jpeg'],
// ];

export const STAFF_IMAGES_CONFIG_MOBILE = [
    [TKACHENKO, KUSTRA, LOTOSHYNSKA],
    [KOVALCHUK, MIYUSHKOVYCH, HAVRYSH],
    [MARCYSHYN, RIZNYK, RASHKEVYCH],
];
