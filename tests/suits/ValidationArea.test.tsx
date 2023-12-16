import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { min, required, Rule, ValidationArea, ValidationField } from '../../src';
import { LocaleManager } from '../../src/LocaleManager';

const passingRule: Rule = {
    name: 'passing',
    message() {
        return ['Passing rule'];
    },
    passed(): boolean | Promise<boolean> {
        return true;
    }
}

const notPassingRule: Rule = {
    name: 'notPassing',
    message() {
        return ['Not passing rule'];
    },
    passed(): boolean | Promise<boolean> {
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
                <ValidationArea errors={errors}>
                    <ValidationField name="test">
                        {({errors}) => (
                            <>
                                {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            </>
                        )}
                    </ValidationField>
                    <button data-testid="add-error" onClick={addError}></button>
                </ValidationArea>
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
            <ValidationArea>
                <ValidationField name="test">
                    {({valid}) => (
                        <>
                            {valid && <p>Valid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        await fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should validate and be valid when input empty, required rule not applied but other is', async () => {
        render(
            <ValidationArea>
                <ValidationField name="test" rules={[min(5)]}>
                    {({valid}) => (
                        <>
                            {valid && <p>Valid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        await fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should validate and not be valid when input empty, required rule applied but not first', async () => {
        render(
            <ValidationArea>
                <ValidationField name="test" rules={[min(5), required]}>
                    {({errors}) => (
                        <>
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            <input data-testid="input" />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        await fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Test should be at least 5')).toBeInTheDocument());
    });

    it('should falsy validate areas', async () => {
        render(
            <ValidationArea>
                {({validate}) => (
                    <>
                        <ValidationField
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
                        </ValidationField>
                        <button data-testid="validate" onClick={() => validate()}></button>
                    </>
                )}
            </ValidationArea>
        );

        await userEvent.click(screen.getByTestId('validate'));
        expect(screen.getByText('Not passing rule')).toBeInTheDocument();
        expect(screen.getByText('Not valid')).toBeInTheDocument();
    });

    it('should truthy validate areas', async () => {
        render(
            <ValidationArea>
                {({validate}) => (
                    <>
                        <ValidationField
                            name="test"
                            rules={[required]}
                        >
                            {({valid}) => (
                                <>
                                    {valid && <p>Valid</p>}
                                    <input value="foo" />
                                </>
                            )}
                        </ValidationField>
                        <button data-testid="validate" onClick={() => validate()}></button>
                    </>
                )}
            </ValidationArea>
        );

        await userEvent.click(screen.getByTestId('validate'));
        expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('should be able to change locale', async () => {
        LocaleManager.setLocale('es', {
            required: '{name} es requerido'
        });

        render(
            <ValidationArea>
                <ValidationField
                    name="test"
                    rules={[required]}
                >
                    {({errors}) => (
                        <>
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                            <input />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        await fireEvent.blur(screen.getByRole('textbox'));
        await waitFor(() => expect(screen.getByText('Test es requerido')).toBeInTheDocument());
    });

    it('should be marked as dirty when input is changed', async () => {
        render(
            <ValidationArea>
                <ValidationField name="test">
                    {({dirty}) => (
                        <>
                            {dirty ? <p>Dirty</p> : <p>Clean</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        expect(screen.getByText('Clean')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        expect(screen.getByText('Dirty')).toBeInTheDocument();
    });

    it('should be marked as touched when input is blurred', async () => {
        render(
            <ValidationArea>
                <ValidationField name="test">
                    {({touched}) => (
                        <>
                            {touched ? <p>Touched</p> : <p>Untouched</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        expect(screen.getByText('Untouched')).toBeInTheDocument();
        fireEvent.blur(screen.getByTestId('input'));
        expect(screen.getByText('Touched')).toBeInTheDocument();
    });
})
