## Coderan: Validator
The smart React element validator

[![example workflow name](https://github.com/coderan-io/validator/workflows/CI/badge.svg)](https://github.com/coderan-io/validator/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/coderan-io/validator/branch/develop/graph/badge.svg?token=OX5CACK0K0)](https://codecov.io/gh/coderan-io/validator)

> [!WARNING]  
> Full V3 docs coming soon! The following docs are updated for V3, but not complete yet.

### Introduction
The goal of this package, is to simplify the struggle of validating elements in React, with a simple system which allows
users to add their own rules.  
The system communicates directly with the elements in the DOM, and is therefore widely compatible with other libraries,
like [Bootstrap](https://react-bootstrap.github.io/).

### The concept
Validator consists of two main elements, an `Area` and a `Field`. Fields are some sort of containers having elements that
need validation as their children. A field scans the underlying components and elements and indexes validatable elements.
  
Areas on the other hand are containers around fields, and allow them to communicate between each other. This communication
is needed in order to match with values in other fields. It can also be used to validate all areas at once, and preventing
actions to happen while not all areas are valid. There should always be an area defined around the fields in your form.

### How to use

#### Field
Basic usage:
```jsx
import { Field } from '@coderan/validator';
import { required } from '@coderan/validator';

<Field rules={[required]}>
    <input name="username" />
</Field>
```
When the input is blurred, the `required` rule is called.

Every field needs a name. This name is used to index fields in the area, and make meaningful error messages. When using
multiple inputs within an field, i.e. when validating a multi-input date of birth, `name` prop is required when defining
the `Field` component. Like so:

```jsx
import { Field, min } from '@coderan/validator';

<Field rules={[min(5)]} name="dob">
    <input name="day" />
    <input name="month" />
    <input name="year" />
</Field>
```

Showing errors:
```jsx
import { Field, min } from '@coderan/validator';

<Field rules={[min(1)]} name="dob">
    {({ errors }) => (
        <>
            <input name="username" />
            { errors.length && <span>{errors[0]}</span> }
        </>
    )}
</Field>
```

#### Provider
Basic usage:
```jsx
import { Form, Field, min } from '@coderan/validator';

<Form>
    {({ validate }) => (
        <>
            <Field rules={[min(1)]} name="dob">
                <input name="day" />
                <input name="month" />
                <input name="year" />
            </Field>
            <Field rules={min(1)} name="dob">
                <input name="day" />
                <input name="month" />
                <input name="year" />
            </Field>
            <button
                onClick={() => validate(() => alert('valid'))}>Check</button>
        </>
    )}
</Form>
```

It is possible to give the validator a `rules` prop as well, whose rules apply to all underlying areas:

```jsx
import { Form, Field, required, min } from '@coderan/validator';

<Form rules={[required]}>
    <Field rules={[min(5)]}>
        {/* on blur, both required and min rules are applied */}
        <input name="username" /> 
    </Field>
</Form>
```

You can create your own rules, as long as it follows this interface:
```typescript
import { FieldManager } from '@coderan/validator';
/**
 * Function to access validator using the rule
 */
export type RuleFunction = (fieldManager: FieldManager) => RuleObject;

/**
 * Object structure rules must implement
 */
export type RuleObject = {
    name: string;
    /**
     * Returns whether the rule passed with the given element(s)
     */
    passed(elements: HTMLElement[], ...args: string[]): boolean | Promise<boolean>;
    /**
     * Message shown when the rule doesn't pass. This returns a tuple with the translation key and the parameters
     */
    message(): [string, Record<string, number | string>?];
}

export type Rule = RuleObject | RuleFunction;
```

Perhaps you would like to use a different name for the message than the `name`-attribute. That's perfectly fine! 
```tsx
import { Field, required } from '@coderan/validator';

<Field rules={[required]} validationName="Surname">
    {({ errors }) => (
        <>
            <input name="username" />
            { errors.length && <span>{errors[0]}</span> }
        </>
    )}
</Field>
```
and when no value is present in the input, a message like "Surname is required" will appear. 

### Happy Coding!
