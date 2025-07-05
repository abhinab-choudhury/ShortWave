import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function axiosInstance() {
  return axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1/`,
    withCredentials: true,
  });
}
