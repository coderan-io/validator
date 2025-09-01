import { Rule, TranslatableRule } from './Rule';
import { allElementsHaveValue } from './common/dom';
import { FieldRegister } from './FieldRegister';

export class Validator {
    private errors: string[] = [];

    public constructor(
        private readonly validatables: HTMLElement[],
        private readonly appliedRules: Rule[],
        private readonly fieldManager: FieldRegister,
    ) {
    }

    /**
     * Validate the validatables
     */
    public async validate(): Promise<boolean> {
        this.errors = [];

        return !(await Promise.all(this.appliedRules.map((rule: Rule) => this.validateRule(rule))))
            .filter((passed: boolean) => !passed)
            .length;
    }

    /**
     * Validate a specific rule
     */
    private async validateRule(rule: Rule): Promise<boolean> {
        if (!this.shouldValidateRule(rule)) {
            return true;
        }

        const passed = await rule.validate(this.validatables, this.fieldManager);

        if (!passed && this.isTranslatableRule(rule)) {
            this.errors.push(rule.message);
        }

        return passed;
    }

    private shouldValidateRule(rule: Rule): boolean {
        if (rule.required) {
            return true;
        }

        return allElementsHaveValue(this.validatables);
    }

    private isTranslatableRule(rule: Rule): rule is TranslatableRule {
        return Object.hasOwn(rule, 'message');
    }

    /**
     * Get all the errors
     */
    public getErrors(): string[] {
        return this.errors;
    }
}
