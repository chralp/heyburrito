import MongoDBDriver from './drivers/MongoDBDriver';
import FileDriver from './drivers/FileDriver';
import ArrayDriver from './drivers/ArrayDriver';
import configInterface from '../types/Config.interface'
export default {
    mongodb: (config: configInterface.doc) => {
        const client = require('mongodb').MongoClient;

        return new MongoDBDriver(client, {
            url: config.MONGODB_URL,
            database: config.MONGODB_DATABASE,
        });
    },
    array: () => {
        return new ArrayDriver();
    },
    file: () => {
        return new FileDriver();
    },
};
