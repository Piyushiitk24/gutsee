import { format, formatDistanceToNow, differenceInHours, startOfDay, endOfDay } from 'date-fns';

/**
 * Format a date for display
 */
export function formatDate(date: Date, formatStr: string = 'MMM d, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Format time for display (using 24-hour format to avoid hydration issues)
 */
export function formatTime(date: Date, formatStr: string = 'HH:mm'): string {
  return format(date, formatStr);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Calculate hours between two dates
 */
export function getHoursBetween(startDate: Date, endDate: Date): number {
  return differenceInHours(endDate, startDate);
}

/**
 * Get the start of today
 */
export function getStartOfToday(): Date {
  return startOfDay(new Date());
}

/**
 * Get the end of today
 */
export function getEndOfToday(): Date {
  return endOfDay(new Date());
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Get hours since a specific time
 */
export function getHoursSince(date: Date): number {
  return getHoursBetween(date, new Date());
}

/**
 * Format duration in minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Get meal type based on time of day
 */
export function getMealTypeFromTime(date: Date): 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' {
  const hour = date.getHours();
  
  if (hour >= 6 && hour < 11) return 'BREAKFAST';
  if (hour >= 11 && hour < 16) return 'LUNCH';
  if (hour >= 16 && hour < 21) return 'DINNER';
  return 'SNACK';
}

/**
 * Calculate time until next target (e.g., 24 hours from irrigation)
 */
export function getTimeUntilTarget(startDate: Date, targetHours: number): {
  hours: number;
  minutes: number;
  isComplete: boolean;
} {
  const now = new Date();
  const targetTime = new Date(startDate.getTime() + (targetHours * 60 * 60 * 1000));
  const difference = targetTime.getTime() - now.getTime();
  
  if (difference <= 0) {
    return {
      hours: 0,
      minutes: 0,
      isComplete: true
    };
  }
  
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours,
    minutes,
    isComplete: false
  };
}
