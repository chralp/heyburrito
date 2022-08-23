
import dotenv from 'dotenv';
dotenv.config({ path: './test/.testing.env' });
global.console.warn = jest.fn();
global.console.debug = jest.fn();
