import {
    getValue, isCanvasElement,
    isInputElement,
    isMeterElement,
    isOutputElement,
    isProgressElement,
    isSelectElement
} from '../common/dom';
import { RuleObject } from '../Rule';

const required: RuleObject = {
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
                return getValue(element).filter(Boolean).length > 0;
            }

            if (isCanvasElement(element)) {
                return element.toDataURL().length > 0;
            }

            return true;
        })
    },

    message() {
        return ['required'];
    }
};

export default required;
