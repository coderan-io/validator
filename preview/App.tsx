import {
    Field,
    Form, required, min,
} from '../src';
import { FC, StrictMode, useState } from 'react';

export const App: FC = () => {
    const [showExtra, setShowExtra] = useState(false);
    const addValidatable = () => {
        setShowExtra(true);
    }

    return (
        <>
            <h1>Preview</h1>
            <p>Preview of the validation library.</p>
            <Form onSubmit={(e) => console.log(e)}>
                <Field
                    rules={[
                        required('Foo is required'),
                        min(5)('Foo should be at least 5 characters long'),
                    ]}
                    name="foo"
                    validateOn="blur"
                >
                    {({errors, valid}) => (
                        <>
                            {valid && <p>Valid</p>}
                            <div><input type="text" /></div>
                            <input type="text" />
                            {showExtra && <input type="text" />}
                            {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                        </>
                    )}
                </Field>
                <div>
                    <button onClick={addValidatable} type="button">Add validatable</button>
                </div>
                <div>
                    <button type="submit">Validate</button>
                </div>
            </Form>
        </>
    );
}
