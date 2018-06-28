const mongodb = require('./drivers/mongodb');

module.exports = {
    mongodb: {
        Driver: mongodb,
        client: () => require('mongodb').MongoClient,
    },
};
