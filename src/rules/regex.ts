import { isInputElement, isSelectElement, getValue } from '../common/dom';
import { RuleObject } from '../Rule';

const regex = (pattern: string): RuleObject => ({
    name: 'regex',
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            const matchesRegex = (value: string) => new RegExp(pattern).test(value);

            if (isInputElement(element) || isSelectElement(element)) {
                return getValue(element).every((value) => matchesRegex(value));
            }

            return true;
        })
    },
    message() {
        return ['regex', { pattern }];
    }
});

export default regex;
