import React from 'react';
import { mount } from 'enzyme';
import { Validator } from '@/Validator';
import { ValidatorArea, ValidatorAreaProps } from '@/components/ValidatorArea';
import ValidatorProvider, { ValidatorProviderProps } from '@/components/ValidatorProvider';
import { ProviderScope } from '@/ProviderScope';

const tick = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    })
}

describe('test ValidatorProvider', () => {
    beforeEach(() => {
        Validator.extend('passes_not', {
            passed(): boolean {
                return false;
            },
            message(): string {
                return 'not passed';
            }
        });
    });

    it('should render input', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea>
                <input name="test" />
            </ValidatorArea>
        );

        expect(area.find('input')).toBeDefined();
    });

    it('should render inputs with callback as child', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea>
                {() => (
                    <input name="test" />
                )}
            </ValidatorArea>
        );

        expect(area.find('input')).toBeDefined();
    })

    it('should throw an exception when no name provided', () => {
        const area = () => {
            mount<ValidatorArea, ValidatorAreaProps>(
                <ValidatorArea>
                    {() => (
                        <>
                            <input/>
                            <input/>
                        </>
                    )}
                </ValidatorArea>
            );
        }
        expect(() => area()).toThrow();
    });

    it('should index (nested) inputs', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea name="test">
                {() => (
                    <>
                        <><input/></>
                        <div>
                            <input />
                            <input />
                            <><input/></>
                        </div>
                    </>
                )}
            </ValidatorArea>
        );

        expect(area.instance().getInputRefs().length).toBe(4);
    });

    it('should apply rules on blur', () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" />
            </ValidatorArea>
        );

        area.find('input').at(0).simulate('blur');
        expect(area.state().errors[0]).toBe('Not passed');
    });

    it('should render error when area dirty', async () => {
        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                {({ errors }) => (
                    <>
                        <input name="test" />
                        {errors.length && <div>{errors[0]}</div>}
                    </>
                )}
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(area.find('div').text()).toBe('Not passed');
    })

    it('should call element\'s provided blur along validator blur', () => {
        const mockFn = jest.fn();

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="passes_not">
                <input name="test" onBlur={mockFn} />
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(mockFn).toBeCalled();
    });

    it('should get all input refs from the provider', async () => {
        Validator.extend('test_all', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs().length === 2;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_all">
                {({ validate }: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="" />
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="" name="test2" />
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)} />
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled()
    });

    it('should get spcific input refs from the provider', async () => {
        Validator.extend('test_specific', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs('test1').length === 2
                && validator.refs('test2').length === 1;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_specific">
                {({ validate }: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="" />
                            <input value="" />
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="" name="test2" />
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)} />
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled()
    });

    it('should return empty array when undefined area name is fetched', async () => {
        Validator.extend('test_not_existing', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs('not_existing').length === 0;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const provider = mount<ValidatorProvider, ValidatorProviderProps>(
            <ValidatorProvider rules="test_not_existing">
                {({ validate }: ProviderScope) => (
                    <>
                        <ValidatorArea name="test1">
                            <input value="" />
                        </ValidatorArea>
                        <ValidatorArea>
                            <input value="" name="test2" />
                        </ValidatorArea>
                        <button onClick={() => validate(mockFn)} />
                    </>
                )}
            </ValidatorProvider>
        );

        provider.find('button').simulate('click');
        await tick();
        expect(mockFn).toHaveBeenCalled();
    });

    it('should not be able to get all refs when not wrapped in provider', () => {
        Validator.extend('no_other_areas', (validator: Validator) => ({
            passed(): boolean {
                return validator.refs('not_existing').length === 0
                    && validator.refs().length === 0;
            },
            message(): string {
                return 'test';
            }
        }))
        const mockFn = jest.fn();

        const area = mount<ValidatorArea, ValidatorAreaProps>(
            <ValidatorArea rules="no_other_areas">
                <input name="test" onBlur={mockFn} />
            </ValidatorArea>
        );

        area.find('input').simulate('blur');
        expect(mockFn).toBeCalled();
    });
})
