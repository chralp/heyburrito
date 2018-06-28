const config = require('../lib/config');
const drivers = require('./manifest');

const driverName = config('DATABASE_DRIVER');

const { Driver, client } = drivers[driverName];

module.exports = new Driver(client());
