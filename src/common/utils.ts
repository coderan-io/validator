/**
 * Return the given string with an uppercase first letter
 */
export const capitalize = (value: string): string => {
    return value.substring(0, 1).toUpperCase() + value.substring(1);
}

/**
 * Checks whether the given value is numeric
 */
export const isNumeric = (value: string): boolean => {
    return !isNaN(+value);
}

export const ensureIsArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value];
