/**
 * Return the given string with an uppercase first letter
 */
import React from 'react';
import { Validator } from '../Validator';

const capitalize = (value: string): string => {
    return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1);
}

/**
 * Checks whether the given value is numeric
 */
const isNumeric = (value: string): boolean => {
    return !isNaN(+value);
}

const isValidatableReactElement = (node: React.ReactElement): boolean => {
    return typeof node.type === 'string'
        && Validator.VALIDATABLE_ELEMENTS.indexOf(node.type) !== -1;
}

const reactElementCanBlur = (element: React.ReactElement): boolean => {
    if (typeof element.type !== 'string') {
        return false;
    }

    return ['input', 'textarea', 'select'].indexOf(element.type) !== -1;
}

export {
    capitalize,
    isNumeric,
    isValidatableReactElement,
    reactElementCanBlur
}
