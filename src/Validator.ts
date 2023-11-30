import { Rule, RuleFunction, RuleObject } from './Rule';
import { getValue, isCanvasElement } from './common/dom';
import { LocaleManager } from './LocaleManager';

export class Validator {
    private errors: string[] = [];
    private localeManager: LocaleManager;

    public constructor(
        private readonly elements: HTMLElement[],
        private readonly appliedRules: Rule[],
        private readonly name: string | null,
        private readonly validationName?: string
    ) {
        this.localeManager = new LocaleManager(this.validationName || this.name);
    }

    public hasRuleApplied(rule: string): boolean {
        return this.appliedRules.some((appliedRule: Rule) => appliedRule.name === rule);
    }

    /**
     * Validate the elements
     */
    public async validate(): Promise<boolean> {
        this.errors = [];

        if (this.hasValidatableElements()) {
            return !(await Promise.all(this.appliedRules.map((rule: Rule) => this.validateRule(rule))))
                .filter((passed: boolean) => !passed)
                .length;
        }

        return true;
    }

    /**
     * Validate a specific rule
     */
    private async validateRule(rule: Rule): Promise<boolean> {
        const ruleObj: RuleObject = this.isRuleFunction(rule) ? rule(this) : rule;

        const passed = await ruleObj.passed(this.elements);

        if (!passed) {
            this.errors.push(this.localeManager.localize(
                ruleObj.message()[0],
                ruleObj.message()[1] || {},
            ));

            return false;
        }

        return true;
    }

    public hasValidatableElements(): boolean {
        return this.elements.some((element: HTMLElement) => this.shouldValidate(element));
    }

    public shouldValidate(element: HTMLElement): boolean {
        if (this.hasRuleApplied('required')) {
            return true;
        }

        return !!getValue(element).length || isCanvasElement(element);
    }

    /**
     * Get all the errors
     */
    public getErrors(): string[] {
        return this.errors;
    }

    /**
     * Indicated whether a given rule name is a rule function
     */
    private isRuleFunction(rule: Rule): rule is RuleFunction {
        return typeof rule === 'function';
    }
}
