import config from '../lib/config'
import drivers from './manifest'

const driverName = config('DATABASE_DRIVER');

const Driver = drivers[driverName];

export default Driver
