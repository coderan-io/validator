import { FC, StrictMode } from 'react';
import {
    ValidationField,
    ValidationArea,
    required,
    min
} from '../src';

export const App: FC = () => {
    return (
        <StrictMode>
            <h1>Preview</h1>
            <p>Preview of the validation library.</p>
            <ValidationArea>
                {({validate}) => (
                    <>
                        <ValidationField
                            name="foo"
                            rules={[required, min(5)]}
                            validateOn="none"
                            validationName="Hiephoi"
                        >
                            {({errors}) => (
                                <>
                                    <div><input type="text" /></div>
                                    <input type="text" />
                                    {errors.length > 0 && errors.map((e) => <p key={e}>{e}</p>)}
                                </>
                            )}
                        </ValidationField>
                        <button onClick={() => validate()}>Validate</button>
                    </>
                )}
            </ValidationArea>
        </StrictMode>
    );
}
