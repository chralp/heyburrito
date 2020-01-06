import { MongoClient } from 'mongodb';
import config from '../config';
import MongoDBDriver from './drivers/MongoDBDriver';
import FileDriver from './drivers/FileDriver';
import ArrayDriver from './drivers/ArrayDriver';

const mongoConf = {
    url: config.db.db_url,
    database: config.db.db_name,
};

export default {
    mongodb: () => new MongoDBDriver(MongoClient, mongoConf),
    array: () => new ArrayDriver(),
    file: () => new FileDriver(),
};
