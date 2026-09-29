import { format, parseISO, isValid } from 'date-fns';

/**
 * Format currency to Vietnamese Dong (VND)
 */
export function formatCurrency(amount: number | string | undefined | null): string {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
}

/**
 * Format ISO date string to DD/MM/YYYY
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return '';
    return format(date, 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Format ISO date string to HH:mm (e.g. 19:30)
 */
export function formatTime(dateString: string | undefined | null): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return '';
    return format(date, 'HH:mm');
  } catch {
    return dateString;
  }
}

/**
 * Format full date & time (e.g. 19:30 - 29/09/2026)
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return '';
    return format(date, 'HH:mm - dd/MM/yyyy');
  } catch {
    return dateString;
  }
}
