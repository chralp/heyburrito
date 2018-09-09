const config = require('../lib/config');
const drivers = require('./manifest');

const driverName = config('DATABASE_DRIVER');

const Driver = drivers[driverName];

module.exports = Driver();
