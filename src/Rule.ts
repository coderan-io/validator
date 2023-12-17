import { FieldManager } from './FieldManager';

/**
 * Function to access validator using the rule
 */
export type RuleFunction = (fieldManager: FieldManager) => RuleObject;

/**
 * Object structure rules must implement
 */
export type RuleObject = {
    name: string;
    /**
     * Returns whether the rule passed with the given element(s)
     */
    passed(elements: HTMLElement[], ...args: string[]): boolean | Promise<boolean>;
    /**
     * Message shown when the rule doesn't pass. This returns a tuple with the translation key and the parameters
     */
    message(): [string, Record<string, number | string>?];
}

export type Rule = RuleObject | RuleFunction;
