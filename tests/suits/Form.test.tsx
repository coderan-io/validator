import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { min, required, Rule, Form, Field } from '../../src';

const passingRule: Rule = {
    message() {
        return ['Passing rule'];
    },
    validate(): boolean | Promise<boolean> {
        return true;
    }
}

const notPassingRule: Rule = {
    message() {
        return ['Not passing rule'];
    },
    validate(): boolean | Promise<boolean> {
        return false;
    }
}

describe('test ValidatorProvider', () => {
    // test setting of errors
    it('should set errors', async () => {
        const TestComponent = () => {
            const [errors, setErrors] = useState<Record<string, string[]>>({test: ['bar']});

            const addError = () => {
                setErrors({
                    test: ['bar', 'baz']
                })
            }

            return (
                <Form errors={errors}>
                    <Field name="test">
                        {({errors}) => (
                            <>
                                {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            </>
                        )}
                    </Field>
                    <button data-testid="add-error" onClick={addError}></button>
                </Form>
            );
        }
        render(<TestComponent />);

        expect(screen.getByText('bar')).toBeInTheDocument();
        expect(screen.queryByText('baz')).not.toBeInTheDocument();

        await userEvent.click(screen.getByTestId('add-error'));
        expect(screen.getByText('bar')).toBeInTheDocument();
        expect(screen.getByText('baz')).toBeInTheDocument();
    });

    it('should not validate and be valid when input empty and no required rule', async () => {
        render(
            <Form>
                <Field name="test">
                    {({valid}) => (
                        <>
                            {valid && <p>Valid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        await fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should validate and be valid when input empty, required rule not applied but other is', async () => {
        render(
            <Form>
                <Field name="test" rules={[min(5)]}>
                    {({valid}) => (
                        <>
                            {valid && <p>Valid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        await fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should validate and not be valid when input empty, required rule applied but not first', async () => {
        render(
            <Form>
                <Field name="test" rules={[min(5), required]}>
                    {({errors}) => (
                        <>
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        await fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Test should be at least 5')).toBeInTheDocument());
    });

    it('should falsy validate areas', async () => {
        render(
            <Form>
                {({validate}) => (
                    <>
                        <Field
                            name="test"
                            rules={[required, notPassingRule]}
                        >
                            {({errors, valid}) => (
                                <>
                                    {!valid && <p>Not valid</p>}
                                    {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                                    <input />
                                </>
                            )}
                        </Field>
                        <button data-testid="validate" onClick={() => validate()}></button>
                    </>
                )}
            </Form>
        );

        await userEvent.click(screen.getByTestId('validate'));
        expect(screen.getByText('Not passing rule')).toBeInTheDocument();
        expect(screen.getByText('Not valid')).toBeInTheDocument();
    });

    it('should truthy validate areas', async () => {
        render(
            <Form>
                {({validate}) => (
                    <>
                        <Field
                            name="test"
                            rules={[required]}
                        >
                            {({valid}) => (
                                <>
                                    {valid && <p>Valid</p>}
                                    <input value="foo" />
                                </>
                            )}
                        </Field>
                        <button data-testid="validate" onClick={() => validate()}></button>
                    </>
                )}
            </Form>
        );

        await userEvent.click(screen.getByTestId('validate'));
        expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('should be marked as dirty when input is changed', async () => {
        render(
            <Form>
                <Field name="test">
                    {({dirty}) => (
                        <>
                            {dirty ? <p>Dirty</p> : <p>Clean</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        expect(screen.getByText('Clean')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        expect(screen.getByText('Dirty')).toBeInTheDocument();
    });

    it('should be marked as touched when input is blurred', async () => {
        render(
            <Form>
                <Field name="test">
                    {({touched}) => (
                        <>
                            {touched ? <p>Touched</p> : <p>Untouched</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        expect(screen.getByText('Untouched')).toBeInTheDocument();
        fireEvent.blur(screen.getByTestId('input'));
        expect(screen.getByText('Touched')).toBeInTheDocument();
    });
})
