import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "alive":
      return "default";
    case "dead":
      return "destructive";
    default:
      return "secondary";
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "alive":
      return "bg-green-500";
    case "dead":
      return "bg-red-500";
    case "unknown":
      return "bg-gray-100";
    default:
      return "bg-gray-500";
  }
};
