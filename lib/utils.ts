import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
 
export function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

 export const Capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
