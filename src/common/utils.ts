/**
 * Return the given string with an uppercase first letter
 */
const capitalize = (value: string): string => {
    return value.substring(0, 1).toUpperCase() + value.substring(1);
}

/**
 * Checks whether the given value is numeric
 */
const isNumeric = (value: string): boolean => {
    return !isNaN(+value);
}

export const arrayToObject = (arr: any[]): Record<string, any> => {
    return arr.reduce((obj, cur, index) => {
        obj[String(index)] = cur;

        return obj;
    }, {});
}

export {
    capitalize,
    isNumeric
}
