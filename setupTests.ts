/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

// overwrite thrown errors
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

require('jest-fetch-mock').enableMocks()
