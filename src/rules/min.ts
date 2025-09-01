import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '../common/dom';
import { isNumeric } from '../common/utils';
import { translatableRule } from '../translatableRule';

export const min = (min: number) => translatableRule({
    validate(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
                || isProgressElement(element)
                || isMeterElement(element)
                || isOutputElement(element)
            ) {
                return getValue(element).every((val: string) => {
                    if (isNumeric(val)) {
                        return parseFloat(val) >= min;
                    }

                    return val.length >= min;
                });
            }

            return true;
        })
    },
});
