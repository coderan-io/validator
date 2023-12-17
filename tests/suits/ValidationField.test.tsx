import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { required, ValidationArea, ValidationField } from '../../src';

describe('test ValidatorProvider', () => {
    test('should not be possible to add multiple fields with the same name', () => {
        const component = () => (
            render(
                <>
                    <ValidationArea>
                        <ValidationField name="test">
                            <input />
                        </ValidationField>
                        <ValidationField name="test">
                            <input />
                        </ValidationField>
                    </ValidationArea>
                </>
            )
        )

        expect(() => component()).toThrowError('Field "test" already added. Validator field names should be unique.');
    });

    it('should be able to use change instead of blur for validation', async  () => {
        render(
            <ValidationArea>
                <ValidationField name="test" validateOn="change">
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input" />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        expect(screen.getByText('Invalid')).toBeInTheDocument();
        fireEvent.blur(screen.getByTestId('input'));
        await waitFor(() => expect(screen.queryByText('Valid')).not.toBeInTheDocument());
        fireEvent.change(screen.getByTestId('input'), { target: { value: 'foo' } });
        await waitFor(() => expect(screen.getByText('Valid')).toBeInTheDocument());
    });

    it('should allow refs to be passed to validatable elements', () => {
        const firstRef = React.createRef<HTMLInputElement | null>();
        let secondRef: HTMLInputElement | null = null;

        render(
            <ValidationArea>
                <ValidationField name="test" rules={[required]}>
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input1" ref={firstRef} />
                        </>
                    )}
                </ValidationField>
                <ValidationField>
                    {({ valid }) => (
                        <>
                            {valid ? <p>Valid</p> : <p>Invalid</p>}
                            <input data-testid="input2" ref={(c) => secondRef = c} />
                        </>
                    )}
                </ValidationField>
            </ValidationArea>
        );

        fireEvent.blur(screen.getByTestId('input1'));
        fireEvent.blur(screen.getByTestId('input2'));
        waitFor(() => expect(screen.queryByText('Invalid')).not.toBeInTheDocument());
        expect(firstRef.current).toBeInTheDocument();
        expect(secondRef).toBeInTheDocument();
    })
})
