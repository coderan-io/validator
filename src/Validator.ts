import { Rule, RuleFunction, RuleObject } from './Rule';
import { getValue, isCanvasElement } from './common/dom';
import { LocaleManager } from './LocaleManager';
import { FieldManager } from './FieldManager';

export class Validator {
    private errors: string[] = [];
    private localeManager: LocaleManager;
    private isRequiredWithRules: string[] = [
        'required',
        'requiredIf',
    ];

    public constructor(
        private readonly elements: HTMLElement[],
        private readonly appliedRules: Rule[],
        private readonly name: string | null,
        private readonly fieldManager: FieldManager,
        private readonly validationName?: string
    ) {
        this.localeManager = new LocaleManager(this.validationName || this.name);
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
        const ruleObj: RuleObject = this.isRuleFunction(rule) ? rule(this.fieldManager) : rule;

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
        return this.shouldBeRequired()
            || isCanvasElement(element)
            || !!getValue(element).filter(Boolean).length;
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

    private shouldBeRequired(): boolean {
        return this.appliedRules.some((rule: Rule) => {
            const name = this.isRuleFunction(rule) ? rule(this.fieldManager).name : rule.name;

            return this.isRequiredWithRules.includes(name);
        });
    }
}
