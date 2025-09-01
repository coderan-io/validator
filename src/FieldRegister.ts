import { FieldDelegate } from './FieldDelegate';

export class FieldRegister {
    public static VALIDATABLE_ELEMENTS: string[] = [
        'canvas', 'input', 'meter', 'select', 'textarea', 'output', 'progress'
    ];

    private fields: Map<string, FieldDelegate> = new Map();

    public addField(name: string, delegate: FieldDelegate) {
        if (this.fields.has(name)) {
            throw new Error(`Field "${name}" already added. Validator field names should be unique.`);
        }

        this.fields.set(name, delegate);
    }

    public removeField(name: string): void {
        this.fields.delete(name);
    }

    public getFields(): Map<string, FieldDelegate> {
        return this.fields;
    }

    public getField(name: string): FieldDelegate | undefined {
        return this.fields.get(name);
    }
}
