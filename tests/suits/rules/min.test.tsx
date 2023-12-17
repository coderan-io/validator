import React from 'react';
import {
    min,
    ValidationArea,
    ValidationField,
    Validator
} from '../../../src';
import {
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react';
import { FieldManager } from '../../../src/FieldManager';

describe('test min rule', () => {
    it('should always validate inputs and not validate non-inputs', async () => {
        const input = document.createElement('input');
        const meter = document.createElement('meter');
        const output = document.createElement('output');
        const progress = document.createElement('progress');
        const canvas = document.createElement('canvas');
        input.value = '4';
        output.value = '4';
        meter.value = 4;
        meter.max = 10;
        progress.value = 4;

        const validator_input = new Validator(
            [input],
            [min(5)],
            '',
            new FieldManager(),
        );

        const validator_meter = new Validator(
            [meter],
            [min(5)],
            '',
            new FieldManager(),
        );

        const validator_output = new Validator(
            [output],
            [min(5)],
            '',
            new FieldManager(),
        );

        const validator_progress = new Validator(
            [progress],
            [min(5)],
            '',
            new FieldManager(),
        );

        const validator_canvas = new Validator(
            [canvas],
            [min(5)],
            '',
            new FieldManager()
        );

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_meter.validate();
        expect(validator_meter.getErrors().length).toBe(1);

        await validator_output.validate();
        expect(validator_output.getErrors().length).toBe(1);

        await validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(1);

        await validator_canvas.validate();
        expect(validator_canvas.getErrors().length).toBe(0);
    });

    it('should validate select', async () => {
        render(
            <ValidationArea>
                <ValidationField rules={[min(5)]} name="test">
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

        await waitFor(() => expect(screen.getByText('Test should be at least 5')).toBeInTheDocument());
    });
});
