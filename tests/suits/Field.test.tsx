import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Field, required } from '../../src';

describe('test ValidatorProvider', () => {
    test('should not be possible to add multiple fields with the same name', () => {
        const component = () => (
            render(
                <>
                    <Form>
                        <Field name="test">
                            <input />
                        </Field>
                        <Field name="test">
                            <input />
                        </Field>
                    </Form>
                </>
            )
        )

        expect(() => component()).toThrowError('Field "test" already added. Validator field names should be unique.');
    });

    it('should be able to use change for validation', async () => {
        render(
            <Form>
                <Field validateOn="change" rules={[required('required')]}>
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        expect(screen.getByText('Invalid')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should be able to use input for validation', async () => {
        render(
            <Form>
                <Field validateOn="input" rules={[required('required')]}>
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        fireEvent.input(screen.getByTestId('input'), { target: { value: 'foo' } });
        await waitFor(() => expect(screen.queryByText('Invalid')).toBeInTheDocument());
        fireEvent.input(screen.getByTestId('input'), { target: { value: 'foo' } });
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should be able to use blur for validation', async () => {
        render(
            <Form>
                <Field validateOn="blur" rules={[required('required')]}>
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.queryByText('Invalid')).toBeInTheDocument());
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should be able to use submit for validation', async () => {
        const fn = jest.fn();
        render(
            <Form onSubmit={fn}>
                <Field rules={[required('required')]}>
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
                <button type="submit" data-testid="submit"></button>
            </Form>
        );

        fireEvent.submit(screen.getByTestId('submit'));
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        fireEvent.submit(screen.getByTestId('submit'));
        await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
    });

    it('should be marked as touched if one of the validatables was touched', async () => {
        render(
            <Form>
                <Field>
                    {({ touched }) => (
                        <>
                            {touched ? <p>Touched</p> : <p>Not touched</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        expect(screen.queryByText('Not touched')).toBeInTheDocument()
        fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.queryByText('Touched')).toBeInTheDocument());
    });

    it('should be marked as dirty if one of the validatables was changed', async () => {
        render(
            <Form>
                <Field>
                    {({ dirty }) => (
                        <>
                            {dirty ? <p>Dirty</p> : <p>Not dirty</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </Field>
            </Form>
        );

        expect(screen.queryByText('Not dirty')).toBeInTheDocument()
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        await waitFor(() => expect(screen.queryByText('Dirty')).toBeInTheDocument());
    });

    it('should be able to validate conditional inputs', async () => {
        const TestComponent = () => {
            const [show, setShow] = React.useState(false);

            return (
                <Form data-testid="form">
                    <Field name="test" rules={[required('required')]}>
                        {({valid}) => (
                            <>
                                {valid && <p>Valid</p>}
                                <input data-testid="input" value="filled" />
                                {show && <input data-testid="input2" />}
                            </>
                        )}
                    </Field>
                    <button data-testid="show" onClick={() => setShow(true)}></button>
                </Form>
            )
        }

        render(<TestComponent />);
        fireEvent.submit(screen.getByTestId('form'));
        await waitFor(() => expect(screen.queryByText('Valid')).toBeInTheDocument());
        fireEvent.click(screen.getByTestId('show'));
        fireEvent.submit(screen.getByTestId('form'));
        await waitFor(() => expect(screen.queryByText('Valid')).not.toBeInTheDocument());
    })
})
