import {
    type ChangeEvent,
    Children, cloneElement,
    type FC,
    isValidElement,
    type ReactElement,
    type ReactNode,
    useContext,
    useEffect,
    useId, useRef,
    useState
} from 'react';
import { ValidationContext } from '../ValidationContext';
import { ValidationHandlerFn } from '../ValidationHandlerFn';
import { isFragment } from 'react-is';
import { Validator } from '../Validator';
import { Rule } from '../Rule';
import { FieldManager } from '../FieldManager';

interface ValidationFieldChildrenCallbackProps {
    dirty: boolean;
    touched: boolean;
    valid: boolean;
    pending: boolean;
    errors: string[];
}

export interface ValidationFieldProps {
    name?: string;
    rules?: Rule[];
    children: ReactNode | ((props: ValidationFieldChildrenCallbackProps) => ReactNode);
    validateOn?: 'blur' | 'change' | 'none';
    validationName?: string;
}

const isValidatableElement = (node: ReactElement) => {
    return typeof node.type === 'string' && FieldManager.VALIDATABLE_ELEMENTS.includes(node.type);
}

const elementCanBlur = (node: ReactElement): boolean => {
    return typeof node.type === 'string' && ['input', 'textarea', 'select'].includes(node.type);
}

/**
 * TODO why rendered again when blurred for the second time
 */
export const ValidationField: FC<ValidationFieldProps> = ({
    name,
    rules,
    children,
    validateOn = 'blur',
    validationName,
}) => {
    const fieldId = name || useId();
    const validationContext = useContext(ValidationContext);
    const elementRefs = useRef<Record<string, HTMLElement>>({});
    const [dirty, setDirty] = useState(false);
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [pending, setPending] = useState(false);

    const validate: ValidationHandlerFn = async () => {
        setPending(true);

        const validator = new Validator(
            Object.values(elementRefs.current),
            Array.isArray(rules) ? rules : [rules],
            name,
            validationName
        );

        const passed = await validator.validate();

        setPending(false);

        if (!passed) {
            setValid(false);
            setErrors(validator.getErrors());

            return false;
        }

        setValid(true);
        setErrors([]);

        return true;
    }

    useEffect(() => {
        validationContext.addField(fieldId, validate);

        return () => validationContext.removeField(fieldId);
    }, []);

    const onChildBlur = () => {
        setTouched(true);

        if (validateOn === 'blur') {
            validate();
        }
    }

    const onChildChange = () => {
        setDirty(true);
        setTouched(true);

        if (validateOn === 'change') {
            validate();
        }
    }

    const mapChildren = (children: ReactNode) => {
        return Children.map(children, (child) => {
            if (
                !isValidElement(child)
                && !isFragment(child)
            ) {
                return child;
            }

            if (child.props.children && child.type !== 'select') {
                return cloneElement(child, {
                    ...child.props,
                    children: mapChildren(child.props.children)
                });
            }

            if (!child.props['data-validation-id'] && isValidatableElement(child)) {
                const id = useId();

                return cloneElement(child, {
                    ...child.props,
                    'data-validation-id': id,
                    ref: (node: HTMLElement) => {
                        elementRefs.current[id] = node;
                    },
                    onBlur: (event: FocusEvent) => {
                        child.props.onBlur?.(event);

                        if (elementCanBlur(child)) {
                            onChildBlur();
                        }
                    },
                    onChange: (event: ChangeEvent) => {
                        child.props.onChange?.(event);

                        onChildChange();
                    },
                });
            }

            return child;
        });
    }

    return mapChildren(
        typeof children === 'function'
            ? children({dirty, touched, valid, pending, errors})
            : children
    )
}
