import { FieldRegister } from './FieldRegister';

/**
 * Object structure rules must implement
 */
export type RuleConfig = {
    /**
     * Returns whether the rule passed with the given element(s)
     */
    validate(elements: HTMLElement[], fieldManager: FieldRegister): boolean | Promise<boolean>;
    /**
     * Indicates whether the rule requires the element to have a value.
     * When false, the checking of the rule will be skipped if the element
     * has no value.
     *
     * Default: false
     */
    required?: boolean;
}

export type TranslatableRule = RuleConfig & {
    message: string;
}

export type Rule = RuleConfig | TranslatableRule;
