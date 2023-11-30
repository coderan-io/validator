import '@testing-library/jest-dom';
import React from 'react';
import {
    Validator,
    required
} from '../../src';
import tick from '../common/tick';

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
        Validator.extend('required', required);

        Validator.extend('long_wait', {
            async passed(): Promise<boolean> {
                return new Promise((resolve: (value: boolean) => void): void => {
                    setTimeout(() => {
                        resolve(true);
                    }, 100);
                })
            },
            message(): string {
                return 'test';
            }
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });
})
