import React from 'react';
import { regex, ValidationArea, ValidationField, Validator } from '../../../src';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FieldManager } from '../../../src/FieldManager';

describe('test regex rule', () => {
    it('should always validate inputs and not validate non-inputs', async (): Promise<void> => {
        const input = document.createElement('input');
        const canvas = document.createElement('canvas');
        input.value = 'foo,|bar';

        const validator_input = new Validator(
            [input],
            [regex('(\\w)+,(\\w)+')],
            '',
            new FieldManager(),
        );

        const validator_canvas = new Validator(
            [canvas],
            [regex('(\\w)+,(\\w)+')],
            '',
            new FieldManager(),
        );

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);
    });

    it('should validate select', async () => {
        render(
            <ValidationArea>
                <ValidationField rules={[regex('(\\w)+,(\\w)+')]} name="test">
                    {({errors}) => (
                        <>
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            <select name="test" data-testid="select">
                                <option value="4" selected>Option</option>
                            </select>
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() => expect(screen.getByText('Test doesn\'t have a valid format')).toBeInTheDocument());
    });
});
