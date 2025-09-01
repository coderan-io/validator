import {
    type FC,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { ValidationContext } from '../ValidationContext';
import { Rule } from '../Rule';
import { FieldRegister } from '../FieldRegister';
import { Validator } from '../Validator';
import { ValidatablesContainer } from './ValidatablesContainer';

interface ChildrenCallbackProps {
    dirty: boolean;
    touched: boolean;
    valid: boolean;
    pending: boolean;
    errors: string[];
}

export interface FieldProps {
    name?: string;
    rules?: Rule[];
    children: ReactNode | ((props: ChildrenCallbackProps) => ReactNode);
    validateOn?: 'input' | 'blur' | 'change' | 'none';
}

const isValidatableElement = (element: HTMLElement): boolean => {
    return FieldRegister.VALIDATABLE_ELEMENTS
        .includes(element.tagName.toLowerCase());
};

const elementCanBlur = (element: HTMLElement): boolean => {
    return ['input', 'textarea', 'select']
        .includes(element.tagName.toLowerCase());
};

/**
 * TODO why rendered again when blurred for the second time
 */
export const Field: FC<FieldProps> = ({
    name,
    rules = [],
    children,
    validateOn = 'change',
}) => {
    const fieldFallbackId = useId();
    const fieldId = name || fieldFallbackId;
    const validationContext = useContext(ValidationContext);
    const validatables = useRef<HTMLElement[]>([]);
    const fieldsContainerRef = useRef<HTMLDivElement>();

    const [dirty, setDirty] = useState(false);
    const [touched, setTouched] = useState(false);
    const [valid, setValid] = useState(false);
    const [errors, setErrors] = useState<Set<string>>(new Set());
    const [pending, setPending] = useState(false);

    const onValidatableAdded = (validatable: HTMLElement): void => {
        validatables.current.push(validatable);
        initElement(validatable);

        setValid(false);
    };

    const onValidatableRemoved = (validatable: HTMLElement) => {
        validatables.current = validatables.current.filter(
            (ref: HTMLElement) => ref !== validatable
        );

        setValid(false);
    };

    const onFieldMutated = (mutationRecords: MutationRecord[]): void => {
        mutationRecords.forEach(function (mutationRecord: MutationRecord) {
            mutationRecord.addedNodes.forEach(function (node: Node) {
                if (node instanceof HTMLElement && isValidatableElement(node)) {
                    onValidatableAdded(node);
                }
            });

            mutationRecord.removedNodes.forEach(function (node: Node) {
                if (node instanceof HTMLElement && isValidatableElement(node)) {
                    onValidatableRemoved(node);
                }
            });
        });
    }

    const observerRef = useRef(new MutationObserver(onFieldMutated));

    useEffect(() => {
        validationContext.fieldManager.addField(fieldId, {
            getValidatables: () => validatables.current,
            validate,
        });

        indexChildren(fieldsContainerRef.current!);

        return () => {
            validationContext.fieldManager.removeField(fieldId);
        }
    }, []);

    const initElement = (element: HTMLElement): void => {
        if (elementCanBlur(element)) {
            element.addEventListener('blur', onElementBlur);
        }

        element.addEventListener('change', onElementChange);
        element.addEventListener('input', onElementInput)
    }

    const validate = async (): Promise<boolean> => {
        if (!pending) {
            setPending(true);
        }

        const validator = new Validator(
            validatables.current,
            rules,
            validationContext.fieldManager,
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

    const onElementBlur = (): void => {
        if (!touched) setTouched(true);

        if (validateOn === 'blur') {
            validate();
        }
    };

    const onElementChange = (): void => {
        if (!dirty) setDirty(true);

        if (validateOn === 'change') {
            validate();
        }
    };

    const onElementInput = (): void => {
        if (validateOn === 'input') {
            validate();
        }
    };

    const indexChildren = (field: HTMLDivElement): void => {
        observerRef.current.observe(fieldsContainerRef.current, {
            childList: true,
            subtree: true,
        })

        const validatableElements = field.querySelectorAll<HTMLElement>(
            FieldRegister.VALIDATABLE_ELEMENTS.join(',')
        );

        validatables.current = Array.from(validatableElements);

        validatableElements.forEach(initElement);
    };

    return (
        <ValidatablesContainer>
            {typeof children === 'function'
                ? children({
                    dirty,
                    touched,
                    valid,
                    pending,
                    errors: Array.from(errors),
                })
                : children}
        </ValidatablesContainer>
    );
};
