import { createContext } from 'react';
import { FieldRegister } from './FieldRegister';

export interface ValidationContextProps {
    fieldManager: FieldRegister;
    errors: Record<string, string[]>;
}
export const ValidationContext = createContext<ValidationContextProps>({
    fieldManager: new FieldRegister(),
    errors: {},
});
