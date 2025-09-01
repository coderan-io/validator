import { FieldRegister } from '../FieldRegister';
import { getValues } from '../common/dom';
import { required } from './required';
import { ensureIsArray } from '../common/utils';
import { translatableRule } from '../translatableRule';

export const requiredIf = (
    otherField: string,
    requiredValue: string | string[],
) => translatableRule({
    validate: (elements: HTMLElement[], fieldManager: FieldRegister) => {
        const otherFieldsElements = fieldManager
            .getField(otherField)
            ?.getValidatables();

        if (!otherFieldsElements) {
            return true;
        }

        const requiredValuesAsArray = ensureIsArray<string>(requiredValue);

        const otherFieldValues = getValues(otherFieldsElements);

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

        return isRequired
            ? required('').validate(elements, fieldManager)
            : true;
    },
    required: true,
});
