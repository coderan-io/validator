import React from 'react';
import {
    Validator,
} from '../../src';

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

        Validator.extend('passes', {
            passed(): boolean {
                return true;
            },
            message(): string {
                return 'passed';
            }
        });
    });
})
