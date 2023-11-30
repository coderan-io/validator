import { ValidationHandlerFn } from './ValidationHandlerFn';

export class FieldManager {
    public static VALIDATABLE_ELEMENTS: string[] = [
        'canvas', 'input', 'meter', 'select', 'textarea', 'output', 'progress'
    ];

    private fields: Map<string, ValidationHandlerFn> = new Map();

    public addField(name: string, validationHandler: ValidationHandlerFn) {
        if (this.fields.has(name)) {
            throw new Error(`Field "${name}" already added. Validator field names should be unique.`);
        }

        this.fields.set(name, validationHandler);
    }

    public removeField(name: string) {
        this.fields.delete(name);
    }

    public getFields(): Map<string, ValidationHandlerFn> {
        return this.fields;
    }
}
