import {
    type FC,
    type ReactNode,
    useCallback,
    useRef,
    useState
} from 'react';
import { ValidationContext } from '../ValidationContext';
import { type ValidationHandlerFn } from '../ValidationHandlerFn';
import { FieldManager } from '../FieldManager';

export interface ValidationAreaChildrenCallbackProps {
    dirty: boolean;
    touched: boolean;
    validate: (onValidCallback?: () => void) => Promise<boolean>;
}

export interface ValidationProviderProps {
    children: ReactNode | ((props: ValidationAreaChildrenCallbackProps) => ReactNode);
}

export const ValidationArea: FC<ValidationProviderProps> = ({
    children
}) => {
    const fieldManager = useRef(new FieldManager());
    const [valid, setValid] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const addField = useCallback((name: string, validateFn: ValidationHandlerFn) => {
        fieldManager.current.addField(name, validateFn);
    }, []);

    const removeField = useCallback((name: string) => {
        fieldManager.current.removeField(name);
    }, []);

    const validateFields = async (
        onValidCallback?: () => void
    ) => {
        const fields = fieldManager.current.getFields();

        try {
            await Promise.all(Array.from(fields).map(([_name, validateFn]) => validateFn()));

            setValid(true);

            onValidCallback();

            return true;
        } catch (e: any) {
            // validation errors
            setValid(false);

            return false;
        }
    };

    return (
        <ValidationContext.Provider value={{
            addField,
            removeField,
        }}>
            {typeof children === 'function'
                ? children({
                    dirty: false,
                    touched: false,
                    validate: (onValidCallback?: () => void) => validateFields(onValidCallback)
                })
                : children
            }
        </ValidationContext.Provider>
    )
}
