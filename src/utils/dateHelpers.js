import { format, parseISO, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, isWithinInterval } from 'date-fns';

/**
 * Format a date to a readable string
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Get the start of the current month
 */
export const getCurrentMonthStart = () => {
    return startOfMonth(new Date());
};

/**
 * Get the end of the current month
 */
export const getCurrentMonthEnd = () => {
    return endOfMonth(new Date());
};

/**
 * Get the start of the current year
 */
export const getCurrentYearStart = () => {
    return startOfYear(new Date());
};

/**
 * Get the end of the current year
 */
export const getCurrentYearEnd = () => {
    return endOfYear(new Date());
};

/**
 * Get month name from date
 */
export const getMonthName = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM');
};

/**
 * Get year from date
 */
export const getYear = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy');
};

/**
 * Check if a date is in the current month
 */
export const isCurrentMonth = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isWithinInterval(dateObj, {
        start: getCurrentMonthStart(),
        end: getCurrentMonthEnd(),
    });
};

/**
 * Check if a date is in the current year
 */
export const isCurrentYear = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isWithinInterval(dateObj, {
        start: getCurrentYearStart(),
        end: getCurrentYearEnd(),
    });
};

/**
 * Get date range for last N months
 */
export const getLastNMonthsRange = (n) => {
    const end = new Date();
    const start = subMonths(end, n);
    return { start, end };
};

/**
 * Get month and year string
 */
export const getMonthYearString = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM yyyy');
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateString) => {
    if (!dateString) return null;
    return parseISO(dateString);
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = () => {
    return format(new Date(), 'yyyy-MM-dd');
};
