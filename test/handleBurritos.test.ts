import { init } from './lib/seedDatabase';
import { handleBurritos } from '../src/handleBurritos';
import * as config from '../src/config';
let mongod: any, mongoDriver: any;

describe('handleBurritos-test', () => {
  [
    // {
    //   describe: 'file Driver',
    //   driver: 'file'
    // },
    {
      describe: 'Array Driver',
      driver: 'array'
    },
    // {
    //   describe: 'Mongodb Driver',
    //   driver: 'mongodb'
    // },
  ].forEach((test) => {
    describe(test.describe, () => {

      async function connectDB(seedDB = false) {
        const dbinit: any = await init({ driver: test.driver, random: false, seedDB });
        if (dbinit.mongod && dbinit.mongoDriver) {
          mongod = dbinit.mongod
          mongoDriver = dbinit.mongoDriver
        }
      }

      async function closeDB() {
        if (test.driver === 'mongodb') {
          if (mongoDriver.client) await mongoDriver.client.close();
          if (mongod) await mongod.stop();
        }
      }

      beforeAll(async () => {
        await connectDB()

      });

      afterAll(async () => {
        await closeDB()
      });





      describe('USER1 should give USER2 5 burritos', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const updates = [
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' }];
          await handleBurritos('USER1', updates)
        });
      });

      describe('USER1 should NOT give USER2 5 burritos', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const updates = [
            { username: 'USER1', burritoType: 'inc' },
            { username: 'USER1', burritoType: 'inc' },
            { username: 'USER1', burritoType: 'inc' },
            { username: 'USER1', burritoType: 'inc' },
            { username: 'USER1', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' }];
          await handleBurritos('USER2', updates)
        });
      });



    });
  });
});
