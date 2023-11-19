import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { uk } from 'date-fns/locale';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getFirstLetters = (value: string, limit?: number): string => {
    if (!value) {
        return '--';
    }

    return value
        .trim()
        .replace(/\s{2,}/g, ' ')
        .split(' ', limit)
        .map((word) => {
            return word?.[0]?.toLocaleUpperCase();
        })
        .join('');
};

export const formatDate = (date: Date) => {
    return format(date, 'dd MMM yyyy, HH:mm', {
        locale: uk,
    });
};

export const getSelectionText = () => {
    let text = '';
    if (window.getSelection !== null) {
        text = window.getSelection()!.toString();
    }

    return text;
};

export const clickOnLink = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.click();
};

export const copyToClipboard = async (text: string, onSuccess: () => void, onError?: () => void) => {
    await navigator.clipboard.writeText(text).then(onSuccess, onError).catch(onError);
};

export const shimmer = (w: number, h: number) => {
    return `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
};

export const toBase64 = (str: string) => {
    return typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
};

export const moveItem = <T>(data: T[], from: number, to: number) => {
    // remove `from` item and store it
    const f = data.splice(from, 1)[0];

    if (f) {
        // insert stored item into position `to`
        data.splice(to, 0, f);
    }
};
