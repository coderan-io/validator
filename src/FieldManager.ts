import { FieldHandlers } from './FieldHandlers';

export class FieldManager {
    public static VALIDATABLE_ELEMENTS: string[] = [
        'canvas', 'input', 'meter', 'select', 'textarea', 'output', 'progress'
    ];

    private fields: Map<string, FieldHandlers> = new Map();

    public addField(name: string, fieldHandlers: FieldHandlers) {
        if (this.fields.has(name)) {
            throw new Error(`Field "${name}" already added. Validator field names should be unique.`);
        }

        this.fields.set(name, fieldHandlers);
    }

    public removeField(name: string) {
        this.fields.delete(name);
    }

    public getFields(): Map<string, FieldHandlers> {
        return this.fields;
    }

    public getField(name: string): FieldHandlers | undefined {
        return this.fields.get(name);
    }
}
