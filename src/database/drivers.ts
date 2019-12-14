import config from '../config'
import MongoDBDriver from './drivers/MongoDBDriver';
import FileDriver from './drivers/FileDriver';
import ArrayDriver from './drivers/ArrayDriver';

export default {
    mongodb: () => {
        const client = require('mongodb').MongoClient;

        return new MongoDBDriver(client, {
            url: config.db.db_url,
            database: config.db.db_name,
        });
    },
    array: () => {
        return new ArrayDriver();
    },
    file: () => {
        return new FileDriver();
    },
};