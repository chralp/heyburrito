import fs from 'fs';
import { expect } from 'chai';
import MongoMemoryServer from 'mongodb-memory-server';

import BurritoStore from '../src/store/BurritoStore';
import databaseDrivers from '../src/database/drivers';


let mongod, mongoDriver;

describe('Burritostore-test', async () => {

    [
        {
            describe: 'file Driver',
            driver: 'file'
        },
        {
            describe: 'Array Driver',
            driver: 'array'
        },
        {
            describe: 'Mongodb Driver',
            driver: 'mongodb'
        },
    ].forEach((test) => {


        describe(test.describe, async () => {

            before(async () => {
                if (test.driver === 'file') {

                    // Delete test database file
                    try {
                        fs.unlinkSync('./test/database/burrito.database');
                    }
                    catch (e) { }
                };

                if (test.driver === 'mongodb') {

                    mongod = new MongoMemoryServer();
                    const uri = await mongod.getConnectionString();
                    const database = await mongod.getDbName();
                    mongoDriver = databaseDrivers[test.driver]({ db_uri: uri, db_name: database })
                    BurritoStore.setDatabase(mongoDriver)
                } else {
                    BurritoStore.setDatabase(databaseDrivers[test.driver]())
                }
            });

            after(async () => {
                if (test.driver === 'mongodb') {
                    if (mongoDriver.client) await mongoDriver.client.close();
                    if (mongod) await mongod.stop();
                }
            });

            describe('giveBurrito', async () => {

                it('Should give burrito and return event', async () => {
                    const res1 = await BurritoStore.giveBurrito('USER1', 'USER2');
                    const res2 = await BurritoStore.giveBurrito('USER1', 'USER2');
                    const res3 = await BurritoStore.giveBurrito('USER1', 'USER2');
                    const res4 = await BurritoStore.giveBurrito('USER3', 'USER2');
                    const res5 = await BurritoStore.giveBurrito('USER1', 'USER2');
                    const res6 = await BurritoStore.giveBurrito('USER3', 'USER2');
                    const res7 = await BurritoStore.giveBurrito('USER2', 'USER1');
                    const res8 = await BurritoStore.giveBurrito('USER2', 'USER1');
                    expect(res1).to.equal('USER1');
                    expect(res2).to.equal('USER1');
                    expect(res3).to.equal('USER1');
                    expect(res4).to.equal('USER3');
                    expect(res5).to.equal('USER1');
                    expect(res6).to.equal('USER3');
                    expect(res7).to.equal('USER2');
                    expect(res8).to.equal('USER2');

                });
            });
            describe('takeAwayBurrito', () => {

                it('Should not takeaway burrito, lowset score is 0', async () => {
                    const res = await BurritoStore.takeAwayBurrito('USER5', 'USER1');
                    const res2 = await BurritoStore.takeAwayBurrito('USER4', 'USER2');
                    expect(res).to.deep.equal([]);
                    expect(res2).to.deep.equal([]);
                });

                it('Should take away burrito', async () => {
                    const res1 = await BurritoStore.takeAwayBurrito('USER1', 'USER2');
                    const res2 = await BurritoStore.takeAwayBurrito('USER2', 'USER1');
                    const res3 = await BurritoStore.takeAwayBurrito('USER3', 'USER1');
                    const res4 = await BurritoStore.takeAwayBurrito('USER3', 'USER1');
                    expect(res1).to.equal('USER1');
                    expect(res2).to.equal('USER2');
                    expect(res3).to.equal('USER3');
                    expect(res4).to.equal('USER3');
                });

            });

            describe('getUserStats', () => {

                it('Should return userstats for USER1', async () => {
                    const res = await BurritoStore.getUserStats('USER1');
                    expect(res).to.deep.equal({
                        receivedToday: 5,
                        givenToday: 5,
                        _id: 'USER1',
                        received: 5,
                        given: 5
                    });
                });

                it('Should return userstats for USER2', async () => {
                    const res = await BurritoStore.getUserStats('USER2');
                    expect(res).to.deep.equal({
                        receivedToday: 3,
                        givenToday: 7,
                        _id: 'USER2',
                        received: 3,
                        given: 7
                    });
                });

                it('Should return userstats for USER3', async () => {
                    const res = await BurritoStore.getUserStats('USER3');
                    expect(res).to.deep.equal({
                        receivedToday: 4,
                        givenToday: 0,
                        _id: 'USER3',
                        received: 4,
                        given: 0
                    });
                });
            });

            describe('getScoreBoard', () => {

                it('Should return scoreboard, listType: to, scoreType: inc', async () => {
                    const res = await BurritoStore.getScoreBoard({ listType: 'to', scoreType: 'inc' });
                    expect(res).to.deep.equal([
                        { _id: 'USER1', score: 4 },
                        { _id: 'USER3', score: 2 },
                        { _id: 'USER2', score: 2 }
                    ])
                });

                it('Should return scoreboard, listType: to, scoreType: dec', async () => {
                    const res = await BurritoStore.getScoreBoard({ listType: 'to', scoreType: 'dec' });
                    expect(res).to.deep.equal([
                        { _id: 'USER1', score: 1 },
                        { _id: 'USER3', score: 2 },
                        { _id: 'USER2', score: 1 }
                    ]);
                });

                it('Should return scoreboard, listType: from, scoreType: inc', async () => {
                    const res = await BurritoStore.getScoreBoard({ listType: 'from', scoreType: 'inc' });
                    expect(res).to.deep.equal([
                        { _id: 'USER2', score: 6 },
                        { _id: 'USER1', score: 2 }
                    ]);
                });

                it('Should return scoreboard, listType: from, scoreType: dec', async () => {
                    const res = await BurritoStore.getScoreBoard({ listType: 'from', scoreType: 'dec' });
                    expect(res).to.deep.equal([
                        { _id: 'USER2', score: 1 },
                        { _id: 'USER1', score: 3 }
                    ]);
                });


                it('Should return scoreboard, user:USER1, listType: to', async () => {
                    const res = await BurritoStore.getScoreBoard({ user: 'USER1', listType: 'to' });
                    expect(res).to.deep.equal([
                        { _id: 'USER2', scoreinc: 2, scoredec: 1 },
                        { _id: 'USER3', scoreinc: 0, scoredec: 2 }
                    ]);
                });

                it('Should return scoreboard, user:USER1, listType: from', async () => {
                    const res = await BurritoStore.getScoreBoard({ user: 'USER1', listType: 'from' });
                    expect(res).to.deep.equal([{ _id: 'USER2', scoreinc: 4, scoredec: 1 }]);
                });


                it('Should return scoreboard, user:USER2, listType: to', async () => {
                    const res = await BurritoStore.getScoreBoard({ user: 'USER2', listType: 'to' });
                    expect(res).to.deep.equal([
                        { _id: 'USER1', scoreinc: 4, scoredec: 1 },
                        { _id: 'USER3', scoreinc: 2, scoredec: 0 }
                    ]);
                });

                it('Should return scoreboard, user:USER2, listType: from', async () => {
                    const res = await BurritoStore.getScoreBoard({ user: 'USER2', listType: 'from' });
                    expect(res).to.deep.equal([{ _id: 'USER1', scoreinc: 2, scoredec: 1 }]);
                });


                it('Should return scoreboard, user:USER3, listType: to', async () => {
                    const res = await BurritoStore.getScoreBoard({ user: 'USER3', listType: 'to' });

                    expect(res).to.deep.equal([]);
                });

                it('Should return scoreboard, user:USER3, listType: from', async () => {
                    const res = await BurritoStore.getScoreBoard({ user: 'USER3', listType: 'from' });
                    expect(res).to.deep.equal([
                        { _id: 'USER2', scoreinc: 2, scoredec: 0 },
                        { _id: 'USER1', scoreinc: 0, scoredec: 2 }
                    ]);
                });

            });
            describe('givenBurritosToday', () => { });
        })
    });


});
