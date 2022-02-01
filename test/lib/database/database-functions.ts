import { init } from './index';

let DBmongoDriver, DBmongod;

export async function connectDB(driver) {
  const { mongoDriver, mongod } = await init({ driver });
  if (mongod && mongoDriver) {
    DBmongod = mongod
    DBmongoDriver = mongoDriver
  }
}

export async function closeDB(driver) {
  if (driver === 'mongodb') {
    if (DBmongoDriver.client) await DBmongoDriver.client.close();
    if (DBmongod) await DBmongod.stop();
  }
}
