import { isNumeric } from '../common/utils';
import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '../common/dom';
import { Rule } from '../Rule';

const max = (max: number): Rule => ({
    name: 'max',
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
                    return isNumeric(val) && parseFloat(val) <= max;
                });
            }

            return true;
        })
    },
    message() {
        return ['max', { max }];
    }
});

export default max;
