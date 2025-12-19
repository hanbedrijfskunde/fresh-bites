/**
 * Format a number as Euro currency
 */
export function formatCurrency(amount: number | null): string {
  if (amount === null) return '€ 0,00';

  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format seconds as MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds as human-readable duration (e.g., "14:32" or "2 minuten")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (minutes === 0) {
    return `${secs} seconden`;
  }

  if (secs === 0) {
    return `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date as time (e.g., "08:32")
 */
export function formatTimeSlot(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse string amount to number (handles Dutch decimal format)
 */
export function parseAmount(value: string): number | null {
  if (!value || value.trim() === '') return null;

  // Remove € symbol and spaces
  const cleaned = value.replace(/€/g, '').replace(/\s/g, '');

  // Replace comma with dot for parsing
  const normalized = cleaned.replace(',', '.');

  const parsed = parseFloat(normalized);

  return isNaN(parsed) ? null : parsed;
}

/**
 * Format number for input (Dutch decimal format)
 */
export function formatAmountForInput(value: number | null): string {
  if (value === null || value === 0) return '';

  // Format with 2 decimals, using comma as decimal separator
  return value.toFixed(2).replace('.', ',');
}

/**
 * Get star emoji representation
 */
export function formatStars(stars: number, max: number = 6): string {
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  let result = '⭐'.repeat(fullStars);

  if (hasHalfStar) {
    result += '✨'; // Half star
  }

  result += '☆'.repeat(emptyStars);

  return result;
}

/**
 * Get percentage formatted
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
}
