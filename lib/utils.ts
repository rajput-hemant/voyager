import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: number) {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const secondsAgo = now - timestamp;

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""}`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""}`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""}`;
  }
}

export function formatTimestampUsingIntl(timestamp: number) {
  const date = new Date(timestamp * 1000);

  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour time format
  });

  // Format the date
  const formattedDate = formatter.format(date);

  return formattedDate.replace(",", ""); // Remove the comma if present
}
