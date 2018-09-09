import * as config from '../lib/config'

module.exports = {
    mongodb: () => {
        const client = require('mongodb').MongoClient;
        const MongoDBDriver = require('./drivers/mongodb');

        return new MongoDBDriver(client, {
            url: config('MONGODB_URL'),
            database: config('MONGODB_DATABASE'),
        });
    },
    array: () => {
        const ArrayDriver = require('./drivers/array');

        return new ArrayDriver();
    },
};
