import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ValidationArea, ValidationField } from '../../../src';
import requiredIf from '../../../src/rules/requiredIf';

describe('test required rule', () => {
    it('should validate truthy that other field has values', async () => {
        render(
            <ValidationArea>
                <ValidationField name="reference" rules={[]}>
                    <input value="5" />
                    <input value="foo" />
                    <input value="foo" />
                </ValidationField>
                <ValidationField
                    rules={[requiredIf('reference', ['5', 'foo'])]}
                    name="test"
                >
                    {({ errors }) => (
                        <>
                            {errors.length > 0 &&
                                errors.map((e) => <p key={e}>{e}</p>)}
                            <select name="test" data-testid="select">
                                <option value="">Ch</option>
                            </select>
                        </>
                    )}
                </ValidationField>
            </ValidationArea>,
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() =>
            expect(screen.getByText('Test is required')).toBeInTheDocument(),
        );
    });

    it('should validate falsy that other field doesn\'t have values', async () => {
        render(
            <ValidationArea>
                <ValidationField name="reference" rules={[]}>
                    <input value="5" />
                    <input value="foo" />
                </ValidationField>
                <ValidationField
                    rules={[requiredIf('reference', ['5', 'bar'])]}
                    name="test"
                >
                    {({ valid }) => (
                        <>
                            {!valid && <p>Invalid</p>}
                            <select name="test" data-testid="select">
                                <option value="">Ch</option>
                            </select>
                        </>
                    )}
                </ValidationField>
            </ValidationArea>,
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() =>
            expect(screen.getByText('Invalid')).toBeInTheDocument(),
        );
    });

    it('should validate truthy when the other field does not exist', async () => {
        render(
            <ValidationArea>
                <ValidationField
                    rules={[requiredIf('reference', ['5', 'foo'])]}
                    name="test"
                >
                    {({ valid }) => (
                        <>
                            {valid && <p>Valid</p>}
                            <select name="test" data-testid="select">
                                <option value="">Ch</option>
                            </select>
                        </>
                    )}
                </ValidationField>
            </ValidationArea>,
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() =>
            expect(screen.getByText('Valid')).toBeInTheDocument(),
        );
    })
});
