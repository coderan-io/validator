export type ValidateFunction = () => boolean | Promise<boolean>;

export interface FieldHandlers {
    validate: ValidateFunction;
    getElements: () => HTMLElement[];
}
