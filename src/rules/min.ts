import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '../common/dom';
import { isNumeric } from '../common/utils';
import { RuleObject } from '../Rule';

const min = (min: number): RuleObject => ({
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
                return getValue(element).every((val: string) => {
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
