import { RuleObject } from '../Rule';
import { FieldManager } from '../FieldManager';
import { getValues } from '../common/dom';
import required from './required';
import { ensureIsArray } from '../common/utils';

const requiredIf = (
    otherField: string,
    requiredValue: string | string[],
) =>
    (fieldManager: FieldManager): RuleObject => ({
        name: 'requiredIf',
        passed: (elements: HTMLElement[]) => {
            const otherFieldsElements: HTMLElement[] | undefined = fieldManager
                .getField(otherField)
                ?.getElements();

            if (!otherFieldsElements) {
                return true;
            }

            const requiredValuesAsArray: string[] = ensureIsArray<string>(requiredValue);

            const otherFieldValues: string[] = getValues(otherFieldsElements);

            let isRequired = true;

            for (let i = 0; i < otherFieldValues.length; i++) {
                const shouldBeValue =
                    requiredValuesAsArray[i] ||
                    requiredValuesAsArray[requiredValuesAsArray.length - 1];
                const otherFieldValue = otherFieldValues[i];

                if (otherFieldValue !== shouldBeValue) {
                    isRequired = false;
                    break;
                }
            }

            return isRequired ? required.passed(elements) : true;
        },
        message() {
            return ['requiredIf', {otherField, requiredValue}];
        },
    });

export default requiredIf;
