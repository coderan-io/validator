import React from 'react';
import { regex, Form, Field, Validator } from '../../../src';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FieldRegister } from '../../../src/FieldRegister';

describe('test regex rule', () => {
    it('should always validate inputs and not validate non-inputs', async (): Promise<void> => {
        const input = document.createElement('input');
        const canvas = document.createElement('canvas');
        input.value = 'foo,|bar';

        const validator_input = new Validator(
            [input],
            [regex('(\\w)+,(\\w)+')],
            '',
            new FieldRegister(),
        );

        const validator_canvas = new Validator(
            [canvas],
            [regex('(\\w)+,(\\w)+')],
            '',
            new FieldRegister(),
        );

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);
    });

    it('should validate select', async () => {
        render(
            <Form>
                <Field rules={[regex('(\\w)+,(\\w)+')]} name="test">
                    {({errors}) => (
                        <>
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            <select name="test" data-testid="select">
                                <option value="4" selected>Option</option>
                            </select>
                        </>
                    )}
                </Field>
            </Form>
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() => expect(screen.getByText('Test doesn\'t have a valid format')).toBeInTheDocument());
    });
});
