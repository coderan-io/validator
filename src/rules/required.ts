import {
    getValue,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '../common/dom';
import { Rule } from '../Rule';

const required: Rule = {
    name: 'required',
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (
                isInputElement(element)
                || isSelectElement(element)
                || isMeterElement(element)
                || isOutputElement(element)
                || isProgressElement(element)
            ) {
                const value = getValue(element).filter(Boolean);

                return value.length;
            }

            return true;
        })
    },

    message() {
        return ['required'];
    }
};

export default required;
