import {
    type ChangeEvent,
    Children,
    cloneElement,
    type FC, ForwardedRef,
    isValidElement,
    type ReactElement,
    type ReactNode, Ref,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { ValidationContext } from '../ValidationContext';
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
    children:
    | ReactNode
    | ((props: ValidationFieldChildrenCallbackProps) => ReactNode);
    validateOn?: 'blur' | 'change' | 'none';
    validationName?: string;
}

const isValidatableElement = (node: ReactElement) => {
    return (
        typeof node.type === 'string' &&
        FieldManager.VALIDATABLE_ELEMENTS.includes(node.type)
    );
};

const elementCanBlur = (node: ReactElement): boolean => {
    return (
        typeof node.type === 'string' &&
        ['input', 'textarea', 'select'].includes(node.type)
    );
};

/**
 * TODO why rendered again when blurred for the second time
 */
export const ValidationField: FC<ValidationFieldProps> = ({
    name,
    rules = [],
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
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [pending, setPending] = useState(false);

    useEffect(() => {
        validationContext.fieldManager.addField(fieldId, {
            getElements,
            validate,
        });

        return () => validationContext.fieldManager.removeField(fieldId);
    }, []);

    useEffect(() => {
        if (Object.hasOwn(validationContext.errors, fieldId)) {
            setErrors(new Set(validationContext.errors[fieldId]));
            setValid(false);
        }
    }, [(validationContext.errors[fieldId] || []).join(',')]);

    const getElements = () => {
        return Object.values(elementRefs.current);
    };

    const validate = async (): Promise<boolean> => {
        setPending(true);

        const validator = new Validator(
            Object.values(elementRefs.current),
            rules,
            name,
            validationContext.fieldManager,
            validationName,
        );

        const passed = await validator.validate();

        setPending(false);

        if (!passed) {
            setValid(false);
            setErrors(new Set(validator.getErrors()));

            return false;
        }

        setValid(true);
        setErrors(new Set());

        return true;
    };

    const onElementBlur = () => {
        if (!touched) setTouched(true);

        if (validateOn === 'blur') {
            validate();
        }
    };

    const onElementChange = () => {
        if (!dirty) setDirty(true);

        if (validateOn === 'change') {
            validate();
        }
    };

    const mapChildren = (children: ReactNode) => {
        return Children.map(children, (child) => {
            if (!isValidElement(child) && !isFragment(child)) {
                return child;
            }

            if (child.props.children && child.type !== 'select') {
                return cloneElement(child, {
                    ...child.props,
                    children: mapChildren(child.props.children),
                });
            }

            if (
                !child.props['data-validation-id'] &&
                isValidatableElement(child)
            ) {
                const id = useId();

                // @ts-ignore
                const currentRef: ForwardedRef<HTMLElement> = child.ref;

                return cloneElement(child, {
                    ...child.props,
                    'data-validation-id': id,
                    ref(element: HTMLElement | null) {
                        if (typeof currentRef === 'function') {
                            currentRef(element);
                        } else if (currentRef) {
                            currentRef.current = element;
                        }

                        if (element === null) {
                            delete elementRefs.current[id];

                            return;
                        }

                        elementRefs.current[id] = element;
                    },
                    onBlur(event: FocusEvent) {
                        child.props.onBlur?.(event);

                        if (elementCanBlur(child)) {
                            onElementBlur();
                        }
                    },
                    onChange(event: ChangeEvent) {
                        child.props.onChange?.(event);

                        onElementChange();
                    },
                });
            }

            return child;
        });
    };

    return mapChildren(
        typeof children === 'function'
            ? children({
                dirty,
                touched,
                valid,
                pending,
                errors: Array.from(errors),
            })
            : children,
    );
};
