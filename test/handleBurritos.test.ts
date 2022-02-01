import { init } from './lib/database';
import { handleBurritos } from '../src/handleBurritos';
import BurritoStore from '../src/store/BurritoStore';
import * as config from '../src/config';
import { connectDB, closeDB } from './lib/database/database-functions';
import { notifyUser } from '../src/bot';
import { initSlack } from './lib/slack';

initSlack()
// let DBmongod: any, DBmongoDriver: any;

describe('handleBurritos-test', () => {
  [
    {
      describe: 'file Driver',
      driver: 'file'
    },
//    {
    //   describe: 'Array Driver',
    //   driver: 'array'
    // },
    // // {
    //   describe: 'Mongodb Driver',
    //   driver: 'mongodb'
    // },
  ].forEach((test) => {
    describe(test.describe, () => {

      beforeEach(async () => {
        //await
        await connectDB(test.driver)
      });
      afterEach(async () => await closeDB(test.driver));

      describe('USER1 should give USER2 5inc and 5dec', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const updates = [
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' }];
          await handleBurritos('USER1', updates)
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          const giverDataDec = await BurritoStore.givenToday('USER1', 'from', 'dec');
          expect(giverDataInc).toEqual(5)
          expect(giverDataDec).toEqual(5)
        });
      });

      describe('USER1 should not be able to give USER2 6inc ( CAP 5 )', () => {
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
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          expect(giverDataInc).toEqual(0)
        });
      });


      describe('USER1 should not be able to give USER2 6 dec ( CAP 5 )', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const updates = [
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },];
          await handleBurritos('USER1', updates)
          const giverDataDec = await BurritoStore.givenToday('USER1', 'from', 'dec');
          expect(giverDataDec).toEqual(0)
        });
      });



      describe('USER1 should not be able to give USER2 3 dec 3inc ( CAP 5 )', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const updates = [
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'dec' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
            { username: 'USER2', burritoType: 'inc' },
          ];
          await handleBurritos('USER1', updates)
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          expect(giverDataInc).toEqual(0)
        });
      });

    });
  });
});
