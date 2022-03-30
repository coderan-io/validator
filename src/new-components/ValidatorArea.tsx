import React, { useId, useEffect, useState, useContext } from 'react';
import { RuleOptions } from '../RuleOptions';
import { AreaScope } from '../AreaScope';
import { isFragment } from 'react-is';
import { isValidatableReactElement, reactElementCanBlur } from '../common/utils';
import { flushSync } from 'react-dom';
import { ValidatorAreaPropsWithDefault } from '../components/ValidatorArea';
import { ValidatorContext } from '../ValidatorContext';
import { Validator } from '../Validator';

export interface ValidatorAreaProps {
    rules?: RuleOptions;
    name?: string;
    errors?: string[];
    children: React.ReactNode | ((scope: AreaScope) => React.ReactNode);
    validationName?: string;
}

const CV_TRACKING_ATTR = 'v-tracking-id';

const flattenChildren = (children: React.ReactNode, childRefs: React.ReactElement[] = []): React.ReactElement[] => {
    React.Children.forEach<React.ReactNode>(children, (child: React.ReactNode) => {
        if (React.isValidElement(child) || isFragment(child)) {
            if (child.props.children && child.type !== 'select') {
                flattenChildren(child.props.children, childRefs)
            } else if (isValidatableReactElement(child)) {
                childRefs.push(child);
            }
        }
    });

    return childRefs;
};

const ValidatorArea: React.FC<ValidatorAreaProps> = function({
    children,
    rules = '',
    validationName
}) {
    /**
     * Unique id referencing this area
     */
    const areaId = useId();

    /**
     * The validator context
     */
    const validatorContext: React.ContextType<typeof ValidatorContext> = useContext(ValidatorContext);

    /**
     * The already indexed react elements
     */
    const [chachedHtmlElements, setCachedHtmlElements] = useState<HTMLElement[]>([]);

    /**
     * The refs checked every time
     */
    const [refs, setRefs] = useState<React.ReactElement[]>([]);

    /**
     * Indicates whether an element in this area has been touched
     */
    const [touched, setTouched] = useState<boolean>(false);

    /**
     * Indicates whether an element in this area has been changed
     */
    const [dirty, setDirty] = useState<boolean>(false);

    /**
     * Indicates whether an element in this area has been changed
     */
    const [valid, setValid] = useState<boolean>(true);

    /**
     * Indicates whether an element in this area is pending
     */
    const [pending, setPending] = useState<boolean>(true);

    /**
     * Indicates whether an element in this area is pending
     */
    const [errors, setErrors] = useState<string[]>([]);

    const validate = async (ref?: HTMLElement) => {
        flushSync(() => {
            setValid(true);
            setErrors([]);
            setPending(true);
        });

        const rulesToApply = Validator.mergeRules(rules, validatorContext.rules);
        const refsToValidate = ref ? [ref] : refs;

        const validator = (new Validator(
            refsToValidate,
            rules,
            ref ? ref.getAttribute('name') : this.getName(),
            validationName
        )).setArea(this);
    }

    const cacheUncachedChildren = (uncachedChildren: React.ReactElement[]) => {
        const preparedUncachedChildren = [];

        uncachedChildren.forEach((child: React.ReactElement) => {
            let ref: HTMLElement;
            const id = useId();

            preparedUncachedChildren.push(React.cloneElement(child, {
                [CV_TRACKING_ATTR]: id, //@todo use useId(),
                onBlur: (event: React.FocusEvent): void => {
                    if (child.props.onBlur) {
                        child.props.onBlur(event);
                    }

                    setTouched(true);

                    if (reactElementCanBlur(child)) {
                        validate(ref);
                    }
                },
                onChange: (event: React.ChangeEvent): void => {
                    if (child.props.onChange) {
                        child.props.onChange(event);
                    }

                    setDirty(true);
                },
                ref: (node: HTMLElement) => {
                    if (node) {
                        node.setAttribute(CV_TRACKING_ATTR, id);

                        ref = node;

                        preparedUncachedChildren.push(ref);
                    }
                }
            }));
        })
    }

    const childRefs = flattenChildren(children);

    useEffect(() => {
        setRefs(childRefs);

        cacheUncachedChildren(childRefs.filter((child: React.ReactElement) => {
            return !Object.prototype.hasOwnProperty.call(child, CV_TRACKING_ATTR);
        }))
    }, [ childRefs ]);

    // @TODO useCallback?

    return children;
}

export {
    ValidatorArea
}