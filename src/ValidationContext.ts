import { createContext } from 'react';
import { ValidationHandlerFn } from './ValidationHandlerFn';

export interface ValidationContextProps {
    addField: (name: string, validateFn: ValidationHandlerFn) => void;
    removeField: (name: string) => void;
}
export const ValidationContext = createContext<ValidationContextProps>({
    addField: () => {},
    removeField: () => {},
});
