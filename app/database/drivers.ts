import config from '../lib/config';
import { MongoDBDriver } from './drivers/mongodb';

export default {
    mongodb: () => {
        const client = require('mongodb').MongoClient;
        return new MongoDBDriver(client, {
            url: config('MONGODB_URL'),
            database: config('MONGODB_DATABASE'),
        });
    },
    array: () => {
        const arrayDriver = require('./drivers/array');

        return new arrayDriver();
    },
};
