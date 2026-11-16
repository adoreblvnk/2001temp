import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export type WorkloadTier = "OK" | "WARNING" | "OVERWORKED";

export function getWorkloadTier(weeklyHours: number): WorkloadTier {
  if (weeklyHours > 44.0) return "OVERWORKED";
  if (weeklyHours >= 40.0) return "WARNING";
  return "OK";
}

export function formatHours(h: number): string {
  return `${h.toFixed(1)} h`;
}
