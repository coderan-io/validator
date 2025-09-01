import {
    canvasHasvalue,
    getValue,
    isCanvasElement,
} from '../common/dom';
import { translatableRule } from '../translatableRule';

export const required = translatableRule({
    validate(elements: HTMLElement[]): boolean {
        return elements.every((element: HTMLElement) => {
            if (isCanvasElement(element)) {
                return canvasHasvalue(element);
            }

            return getValue(element).filter(Boolean).length > 0;
        })
    },
    required: true,
});
