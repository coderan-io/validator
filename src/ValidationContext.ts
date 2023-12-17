import { createContext } from 'react';
import { FieldManager } from './FieldManager';

export interface ValidationContextProps {
    fieldManager: FieldManager;
    errors: Record<string, string[]>;
}
export const ValidationContext = createContext<ValidationContextProps>({
    fieldManager: new FieldManager(),
    errors: {},
});
