import {
    FC,
    FormEvent,
    FormHTMLAttributes,
    ReactNode,
    useRef,
    useState
} from 'react';
import { ValidationContext } from '../ValidationContext';
import { FieldRegister } from '../FieldRegister';

export interface ChildrenCallbackProps {
    /**
     * If true, all fields are validated and no errors are present.
     * Default: true
     */
    valid: boolean;
    /**
     * Validates all fields in the form. Returns a promise that resolves
     * when all fields are validated.
     */
    validate: () => Promise<boolean>;
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> {
    /**
     * Represents the content rendered within a component.
     * Can either be a ReactNode or a function that takes
     * `ChildrenCallbackProps` as an argument and returns a ReactNode.
     */
    children: ReactNode | ((props: ChildrenCallbackProps) => ReactNode);
    /**
     * Errors to display, initially or via some external validation.
     * The key is the field id, the value is an array of error messages.
     * Default: {}
     */
    errors?: Record<string, string[]>;
    /**
     * If true, the form will only be submitted if all fields are valid.
     * Default: true
     */
    submitOnlyIfValid?: boolean;
}

export const Form: FC<FormProps> = ({
    children,
    errors = {},
    submitOnlyIfValid = true,
    onSubmit,
    ...rest
}) => {
    const fieldRegister = useRef(new FieldRegister());
    const [valid, setValid] = useState<boolean>(true);

    const validateFields = async (): Promise<boolean> => {
        const fields = fieldRegister.current.getFields();

        const passed = (await Promise.all(
            Array.from(fields)
                .map(([_name, fieldHandlers]) => fieldHandlers.validate())
        )).every((a: boolean): boolean => a);

        setValid(passed);

        return passed;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (! submitOnlyIfValid) {
            onSubmit?.(e);
        }

        const passed = await validateFields();

        if (passed && submitOnlyIfValid) {
            // call user's onSubmit with the original event
            onSubmit?.(e);
        }
    };

    return (
        <ValidationContext.Provider value={{
            fieldManager: fieldRegister.current,
            errors,
        }}>
            <form {...rest} onSubmit={handleSubmit}>
                {typeof children === 'function'
                    ? children({
                        valid,
                        validate: () => validateFields(),
                    })
                    : children
                }
            </form>
        </ValidationContext.Provider>
    )
}
