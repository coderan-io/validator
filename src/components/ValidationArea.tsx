import {
    type FC,
    type ReactNode,
    useMemo,
    useRef,
    useState
} from 'react';
import { ValidationContext } from '../ValidationContext';
import { FieldManager } from '../FieldManager';

export interface ValidationAreaChildrenCallbackProps {
    valid: boolean;
    validate: (onValidCallback?: () => void) => Promise<boolean>;
}

export interface ValidationProviderProps {
    children: ReactNode | ((props: ValidationAreaChildrenCallbackProps) => ReactNode);
    errors?: Record<string, string[]>;
}

export const ValidationArea: FC<ValidationProviderProps> = ({
    children,
    errors = {}
}) => {
    const fieldManager = useRef(new FieldManager());
    const [valid, setValid] = useState<boolean>(true);

    const memoizedErrors = useMemo(() => {
        return errors;
    }, [JSON.stringify(errors)]);

    const validateFields = async (
        onValidCallback?: () => void
    ) => {
        const fields = fieldManager.current.getFields();

        const passed = (await Promise.all(
            Array.from(fields)
                .map(([_name, fieldHandlers]) => fieldHandlers.validate())
        )).every((a) => a);

        if (passed) {
            setValid(true);
            onValidCallback?.();

            return true;
        } else {
            setValid(false);

            return false;
        }
    };

    return (
        <ValidationContext.Provider value={{
            fieldManager: fieldManager.current,
            errors: memoizedErrors,
        }}>
            {typeof children === 'function'
                ? children({
                    valid,
                    validate: (onValidCallback?: () => void) => validateFields(onValidCallback)
                })
                : children
            }
        </ValidationContext.Provider>
    )
}
