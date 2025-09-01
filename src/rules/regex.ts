import { isInputElement, isSelectElement, getValue } from '../common/dom';
import { translatableRule } from '../translatableRule';

export const regex = (pattern: string) => translatableRule({
    validate(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            const matchesRegex = (value: string) => new RegExp(pattern).test(value);

            if (isInputElement(element) || isSelectElement(element)) {
                return getValue(element).every((value) => matchesRegex(value));
            }

            return true;
        })
    },
});

