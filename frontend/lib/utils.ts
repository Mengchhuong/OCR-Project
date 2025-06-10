import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes conditionally.
 * Uses clsx for conditional logic and tailwind-merge to resolve conflicts.
 * @param inputs - Any number of class values (strings, arrays, objects)
 * @returns A single merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a file size in bytes into a human-readable string (B, KB, MB).
 * @param bytes - The file size in bytes
 * @returns A formatted string with appropriate units
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}