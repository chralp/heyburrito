import config from '../lib/config';
import drivers from './drivers';

const driverName = config('DATABASE_DRIVER');
const driver = drivers[driverName];
export default driver();
