import { isInputElement, isSelectElement, getValue } from '../common/dom';
import { Rule } from '../Rule';

const regex = (pattern: string): Rule => ({
    name: 'regex',
    passed(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            const matchesRegex = (value: string) => new RegExp(pattern).test(value);

            if (isInputElement(element) || isSelectElement(element)) {
                const values = getValue(element).filter(Boolean);

                return values.every((value) => matchesRegex(value));
            }

            return true;
        })
    },
    message() {
        return ['regex', { pattern }];
    }
});

export default regex;
