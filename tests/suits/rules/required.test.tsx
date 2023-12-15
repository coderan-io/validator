import React, { useEffect, useRef } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { required, ValidationArea, ValidationField, Validator } from '../../../src';
import { FieldManager } from '../../../src/FieldManager';

describe('test required rule', () => {
    afterEach(cleanup);
    it('should falsely validate select with options', async () => {
        render(
            <ValidationArea>
                <ValidationField rules={[required]} name="test">
                    {({errors}) => (
                        <>
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            <select name="test" data-testid="select">
                                <option value="">Ch</option>
                            </select>
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() => expect(screen.getByText('Test is required')).toBeInTheDocument());
    });

    it('should truthy validate canvas', async () => {
        const TestComponent = () => {
            const canvasRef = useRef<HTMLCanvasElement>(null);

            useEffect(() => {
                const ctx = canvasRef.current?.getContext('2d');
                ctx.fillStyle = '#F00';
                ctx.fillRect(1, 1, 10, 10);
            }, []);

            return (
                <>
                    <ValidationArea>
                        <ValidationField rules={[required]} name="test">
                            {({valid}) => (
                                <>
                                    {valid && <p>Valid</p>}
                                    <canvas ref={canvasRef} data-testid="canvas" width="1" height="1" />
                                    <select name="test" data-testid="select" >
                                        <option value="3" selected></option>
                                    </select>
                                </>
                            )}
                        </ValidationField>
                    </ValidationArea>
                </>
            );
        }

        render(<TestComponent />);

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should falsy validate canvas', async () => {

        render(
            <ValidationArea>
                <ValidationField rules={[required]} name="test">
                    {({valid}) => (
                        <>
                            {!valid && <p>Invalid</p>}
                            <canvas />
                            <select name="test" data-testid="select">
                                <option value="3" selected></option>
                            </select>
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() => expect(screen.getByText('Invalid')).toBeInTheDocument());
    });

    it('should always validate validatable and not validate non-validatable', async () => {
        const input = document.createElement('input');
        const meter = document.createElement('meter');
        const output = document.createElement('output');
        const progress = document.createElement('progress');
        const div = document.createElement('div');

        const validator_input = new Validator(
            [input],
            [required],
            'validator_input',
            new FieldManager(),
        );

        const validator_meter = new Validator(
            [meter],
            [required],
            'validator_input',
            new FieldManager(),
        );

        const validator_output = new Validator(
            [output],
            [required],
            'validator_input',
            new FieldManager(),
        );

        const validator_progress = new Validator(
            [progress],
            [required],
            'validator_input',
            new FieldManager()
        );

        const validator_div = new Validator(
            [div],
            [required],
            'validator_input',
            new FieldManager(),
        );

        await validator_input.validate();
        expect(validator_input.getErrors().length).toBe(1);

        await validator_meter.validate();
        expect(validator_meter.getErrors().length).toBe(1);

        await validator_output.validate();
        expect(validator_output.getErrors().length).toBe(1);

        await validator_progress.validate();
        expect(validator_progress.getErrors().length).toBe(1);

        await validator_div.validate();
        expect(validator_div.getErrors().length).toBe(0);
    });
});
