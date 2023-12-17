import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// overwrite thrown errors
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

// require('jest-fetch-mock').enableMocks()
