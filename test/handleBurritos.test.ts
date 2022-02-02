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
          config.default.slack = { enableOverDraw: false, enableDecrement: false };
          const usBeforeInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usBeforeDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          const updates = [
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' }];
          await handleBurritos('USER1', updates)
          const usAfterInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usAfterDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          const giverDataDec = await BurritoStore.givenToday('USER1', 'from', 'dec');
          expect(usBeforeInc).toEqual(9);
          expect(usBeforeDec).toEqual(4);
          expect(usAfterInc).toEqual(14);
          expect(usAfterDec).toEqual(9);
          expect(giverDataInc).toEqual(5);
          expect(giverDataDec).toEqual(5);
        });
      });

      describe('USER1 should not be able to give USER2 6inc ( CAP 5 )', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const usBeforeInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const updates = [
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' }];
          await handleBurritos('USER1', updates);
          const usAfterInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          expect(usBeforeInc).toEqual(9);
          expect(usAfterInc).toEqual(9);
          expect(giverDataInc).toEqual(0);
        });
      });

      describe('USER1 should not be able to give USER2 6 dec ( CAP 5 )', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: false }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const usBeforeInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usBeforeDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          const updates = [
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' }];
          await handleBurritos('USER1', updates)
          const usAfterInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usAfterDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          const giverDataDec = await BurritoStore.givenToday('USER1', 'from', 'dec');
          expect(usBeforeInc).toEqual(9);
          expect(usBeforeDec).toEqual(4);
          expect(usAfterInc).toEqual(9);
          expect(usAfterDec).toEqual(4);
          expect(giverDataInc).toEqual(0);
          expect(giverDataDec).toEqual(0);
        });
      });

      describe('USER1 should give USER2 2 dec 3inc ( CAP 5 )', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: true }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const usBeforeInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usBeforeDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          const updates = [
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' }];
          await handleBurritos('USER1', updates)
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          const giverDataDec = await BurritoStore.givenToday('USER1', 'from', 'dec');
          const usAfterInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usAfterDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          expect(usBeforeInc).toEqual(5);
          expect(usBeforeDec).toEqual(4);
          expect(usAfterInc).toEqual(6);
          expect(usAfterDec).toEqual(6);
          expect(giverDataInc).toEqual(3);
          expect(giverDataDec).toEqual(2);
        });
      });

      describe('USER1 should not be able to give USER2 3 dec 3inc ( CAP 5 )', () => {
        it(`with ENVS: { enableOverDraw: false, enableDecrement: true }`, async () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true };
          const usBeforeInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usBeforeDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          const updates = [
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'dec' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
            { from: 'USER1', to: 'USER2', type: 'inc' },
          ];
          await handleBurritos('USER1', updates)
          const giverDataInc = await BurritoStore.givenToday('USER1', 'from', 'inc');
          const giverDataDec = await BurritoStore.givenToday('USER1', 'from', 'dec');
          const usAfterInc = await BurritoStore.getUserScore('USER2', 'to', 'inc');
          const usAfterDec = await BurritoStore.getUserScore('USER2', 'to', 'dec');
          expect(usBeforeInc).toEqual(5);
          expect(usBeforeDec).toEqual(4);
          expect(usAfterInc).toEqual(5);
          expect(usAfterDec).toEqual(4);
          expect(giverDataInc).toEqual(0);
          expect(giverDataDec).toEqual(0);
        });
      });




















    });
  });
});
