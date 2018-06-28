const mongodb = require('./drivers/mongodb');
const config = require('../lib/config');

module.exports = {
    mongodb: {
        Driver: mongodb,
        client: () => require('mongodb').MongoClient,
        settings: {
            url: config('MONGODB_URL'),
            database: config('MONGODB_DATABASE'),
        },
    },
};
