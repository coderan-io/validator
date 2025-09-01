import { RuleConfig, TranslatableRule } from './Rule';

export const translatableRule = (ruleConfig: RuleConfig) => {
    return (message: string): TranslatableRule => ({
        ...ruleConfig,
        message,
    });
}
