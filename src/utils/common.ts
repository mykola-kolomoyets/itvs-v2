import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { uk } from "date-fns/locale";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFirstLetters = (value: string, limit?: number): string => {
  if (!value) {
    return "--";
  }

  return value
    .trim()
    .replace(/\s{2,}/g, " ")
    .split(" ", limit)
    .map((word) => {
      return word?.[0]?.toLocaleUpperCase();
    })
    .join("");
};

export const formatDate = (date: Date) => {
  return format(date, "dd MMM yyyy, HH:mm", {
    locale: uk,
  });
};

export const getSelectionText = () => {
  let text = "";
  if (window.getSelection !== null) {
    text = window.getSelection()!.toString();
  }

  return text;
};

export const clickOnLink = (url: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.click();
};

export const copyToClipboard = async (
  text: string,
  onSuccess: () => void,
  onError?: () => void,
) => {
  await navigator.clipboard
    .writeText(text)
    .then(onSuccess, onError)
    .catch(onError);
};
