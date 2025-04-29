import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileExtension(file: File) {
  if (!file) return;

  const mimeType = file.type;

  const extension = mimeType.split("/")[1];

  return extension;
}
