import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '../common/dom';
import { isNumeric } from '../common/utils';
import { Rule } from '../Rule';

const min = (min: number): Rule => ({
    name: 'min',
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
                || isProgressElement(element)
                || isMeterElement(element)
                || isOutputElement(element)
            ) {
                const value = getValue(element);

                return value.every((val: string) => {
                    return isNumeric(val) && parseFloat(val) >= min;
                });
            }

            return true;
        })
    },
    message() {
        return ['min', { min }];
    }
});

export default min;
