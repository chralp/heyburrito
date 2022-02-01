import { init } from './lib/database';
import { handleBurritos } from '../src/handleBurritos';
import * as config from '../src/config';
import { connectDB, closeDB } from './lib/database/database-functions';

// let DBmongod: any, DBmongoDriver: any;

describe('handleBurritos-test', () => {
  [
    // {
    //   describe: 'file Driver',
    //   driver: 'file'
    // },
    // {
    //   describe: 'Array Driver',
    //   driver: 'array'
    // },
    // // // {
    //   describe: 'Mongodb Driver',
    //   driver: 'mongodb'
    // },
  ].forEach((test) => {
    describe(test.describe, () => {

      beforeAll(async () => await connectDB(test.driver));
      afterAll(async () => await closeDB(test.driver));

      describe('USER1 should give USER2 5 burritos', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const updates = [
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' }];
          await handleBurritos('USER1', updates)
        });
      });

      // describe('USER1 should NOT give USER2 5 burritos', () => {
      //   it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
      //     config.default.slack = { enableOverDraw: true, enableDecrement: false }
      //     const updates = [
      //       { username: 'USER1', burritoType: 'inc' },
      //       { username: 'USER1', burritoType: 'inc' },
      //       { username: 'USER1', burritoType: 'inc' },
      //       { username: 'USER1', burritoType: 'inc' },
      //       { username: 'USER1', burritoType: 'inc' },
      //       { username: 'USER2', burritoType: 'inc' },
      //       { username: 'USER2', burritoType: 'inc' },
      //       { username: 'USER2', burritoType: 'inc' },
      //       { username: 'USER2', burritoType: 'inc' },
      //       { username: 'USER2', burritoType: 'inc' }];
      //     await handleBurritos('USER2', updates)
      //   });
      // });



    });
  });
});
