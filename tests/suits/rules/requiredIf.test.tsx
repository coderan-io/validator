import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Field, requiredIf } from '../../../src';

describe('test required rule', () => {
    it('should validate truthy that other field has values', async () => {
        render(
            <Form>
                <Field name="reference" rules={[]}>
                    <input value="5" />
                    <input value="foo" />
                    <input value="foo" />
                </Field>
                <Field
                    rules={[requiredIf('reference', ['5', 'foo'])('Test is required')]}
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
                </Field>
            </Form>,
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() =>
            expect(screen.getByText('Test is required')).toBeInTheDocument(),
        );
    });

    it('should validate falsy that other field doesn\'t have values', async () => {
        render(
            <Form>
                <Field name="reference" rules={[]}>
                    <input value="5" />
                    <input value="foo" />
                </Field>
                <Field
                    rules={[requiredIf('reference', ['5', 'bar'])('Test is required')]}
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
                </Field>
            </Form>,
        );

        fireEvent.blur(screen.getByTestId('select'));

        await waitFor(() =>
            expect(screen.getByText('Invalid')).toBeInTheDocument(),
        );
    });

    it('should validate truthy when the other field does not exist', async () => {
        render(
            <Form>
                <Field
                    rules={[requiredIf('reference', ['5', 'foo'])('Test is required')]}
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
                </Field>
            </Form>,
        );

        fireEvent.change(screen.getByTestId('select'));

        await waitFor(() =>
            expect(screen.getByText('Valid')).toBeInTheDocument(),
        );
    })
});
