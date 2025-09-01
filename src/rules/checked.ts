import {
    isCheckboxElement,
    isRadioElement,
    nodeListToArray
} from '../common/dom';
import { translatableRule } from '../translatableRule';

export const checked = translatableRule({
    validate(elements: HTMLElement[]): boolean  {
        return elements.every((element: HTMLElement): boolean => {
            if (isCheckboxElement(element)) {
                return element.checked;
            }

            if (!isRadioElement(element)) {
                return true;
            }

            if (element.checked) {
                return true;
            }

            const radios = nodeListToArray<HTMLInputElement>(document.querySelectorAll<HTMLInputElement>(
                `input[type="radio"][name="${element.name}"]`
            ));

            return !!radios.length && radios.some((radio: HTMLInputElement) => radio.checked);

        })
    },
});
