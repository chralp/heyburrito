import { MongoClient } from 'mongodb';
import config from '../config';
import MongoDBDriver from './drivers/MongoDBDriver';
import GenericDriver from './drivers/GenericDriver';

export default {
    mongodb: (conf = config.db) => new MongoDBDriver(MongoClient, conf),
    array: () => new GenericDriver('array'),
    file: () => new GenericDriver('file'),
};
