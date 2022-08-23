import BurritoStore from '../src/store/BurritoStore';
import { init } from './lib/database';

let mongod: any, mongoDriver: any;

describe('Burritostore-test', () => {
  [
    {
      describe: 'file Driver',
      driver: 'file'
    },
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

      async function connectDB() {
        const dbinit: any = await init({ driver: test.driver });
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


      describe('giveBurrito', () => {
        it('Should give burrito and return event', async () => {
          const res1 = await BurritoStore.give({ to: 'USER1', from: 'USER2', type: 'inc', overdrawn: false });
          const res2 = await BurritoStore.give({ to: 'USER1', from: 'USER2', type: 'inc', overdrawn: false });
          const res3 = await BurritoStore.give({ to: 'USER2', from: 'USER1', type: 'inc', overdrawn: false });
          const res4 = await BurritoStore.give({ to: 'USER2', from: 'USER1', type: 'inc', overdrawn: false });
          expect(res1).toEqual('USER1');
          expect(res2).toEqual('USER1');
          expect(res3).toEqual('USER2');
          expect(res4).toEqual('USER2');
        });
      });

      describe('takeAwayBurrito', () => {

        it('Should take away burrito', async () => {
          const res1 = await BurritoStore.give({ to: 'USER1', from: 'USER2', type: 'dec', overdrawn: false });
          const res2 = await BurritoStore.give({ to: 'USER1', from: 'USER2', type: 'dec', overdrawn: false });
          const res3 = await BurritoStore.give({ to: 'USER2', from: 'USER1', type: 'dec', overdrawn: false });
          const res4 = await BurritoStore.give({ to: 'USER2', from: 'USER1', type: 'dec', overdrawn: false });
          expect(res1).toEqual('USER1');
          expect(res2).toEqual('USER1');
          expect(res3).toEqual('USER2');
          expect(res4).toEqual('USER2');
        });
      });

      describe('getUserStats', () => {
        it('Should return userstats for USER1', async () => {
          const res = await BurritoStore.getUserStats('USER1');
          expect(res).toEqual({
            receivedToday: 4,
            givenToday: 4,
            _id: 'USER1',
            received: 4,
            given: 4
          });
        });

        it('Should return userstats for USER2', async () => {
          const res = await BurritoStore.getUserStats('USER2');
          expect(res).toEqual({
            receivedToday: 4,
            givenToday: 4,
            _id: 'USER2',
            received: 4,
            given: 4
          });
        });
      });

      describe('givenBurritosToday', () => {
        it('Should return givenBurritosToday stats for USER1 lisyType: to', async () => {
          const res = await BurritoStore.givenToday('USER1', 'to');
          expect(res).toEqual(4)
        });
        it('Should return givenBurritosToday stats for USER1 lisyType: from', async () => {
          const res = await BurritoStore.givenToday('USER1', 'from');
          expect(res).toEqual(4)
        });
        it('Should return givenBurritosToday stats for USER2 lisyType: to', async () => {
          const res = await BurritoStore.givenToday('USER2', 'to');
          expect(res).toEqual(4)
        });
        it('Should return givenBurritosToday stats for USER2 lisyType: from', async () => {
          const res = await BurritoStore.givenToday('USER2', 'from');
          expect(res).toEqual(4)
        });
      });
    })
  });
});
