import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import BurritoStore from '../../../src/store/BurritoStore';
import { env } from '../../../src/lib/utils/env';
import config from '../../../src/config';
import { pathExists, createPath } from '../../../src/lib/utils/path';
import databaseDrivers from '../../../src/database/drivers';
import { scoreBoard } from '../../data/calculatescore-data';
import { randomDate } from '../time'

// await give(toUser, fromUser, pickRandomDate(oneWeek, today));

export const initDatabase = async ({ driver }) => {

  if (env === 'testing' && driver === 'file') {
    if (!pathExists(config.db.db_path)) {
      if (!createPath(config.db.db_path)) {
        throw new Error('Could not create database path');
      }
    }
    try {
      fs.unlinkSync(`${config.db.db_path}${config.db.db_fileName}`);
    }
    catch (e) {
    }
  };

  if (env === 'testing' && driver === 'mongodb') {
    // let mongod = new MongoMemoryServer();
    // const uri = await mongod.getConnectionString();
    // const database = await mongod.getDbName();
    // const mongoDriver = databaseDrivers[driver]({ db_uri: uri, db_name: database });
    // BurritoStore.setDatabase(mongoDriver);
  } else {
    const database = databaseDrivers[driver]();
    BurritoStore.setDatabase(database);
    return Promise.resolve({ driver, database, mongod: false, mongoDriver: false });
  }
}

export const seedDatabase = async (database) => {
  scoreBoard.forEach(async ({ to, from, value, overdrawn}) => {
    await database.give({ to, from, value, given_at: randomDate(), overdrawn});
  })
};
