
export interface FieldDelegate {
    validate: () => boolean | Promise<boolean>;
    getValidatables: () => HTMLElement[];
}
