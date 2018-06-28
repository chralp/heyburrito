const config = require('../lib/config');
const drivers = require('./manifest');

const driverName = config('DATABASE_DRIVER');

const { Driver, client, settings } = drivers[driverName];

module.exports = new Driver(client(), settings);
