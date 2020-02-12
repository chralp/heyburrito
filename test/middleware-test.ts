import { expect } from 'chai';

import { init } from './lib/seedDatabase';
import {
    scoreBoardToIncFalse,
    scoreBoardFromIncFalse,
    scoreBoardToDecFalse,
    scoreBoardFromDecFalse,
    scoreBoardToIncTrue,
    scoreBoardFromIncTrue,
    scoreBoardToDecTrue,
    scoreBoardFromDecTrue,
    userStatsUser1,
    userStatsUser2,
    userStatsUser3,
    userStatsUser4,
} from './data/middleware-results';


let mongod: any, mongoDriver: any
const proxyquire = require('proxyquire').noCallThru();
let getScoreBoard: any, getUserStats: any, givenBurritosToday: any, getUserScore: any

const loadMiddleware = ({ enable_decrement }) => {
    const funcs = proxyquire('../src/middleware', { './config': { slack: { enableDecrement: enable_decrement } } });
    getScoreBoard = funcs.getScoreBoard
    getUserStats = funcs.getUserStats
    getUserScore = funcs.getUserScore
    givenBurritosToday = funcs.givenBurritosToday
}

describe('middleware-test', async () => {
    [
        {
            describe: 'With file Driver as database',
            driver: 'file'
        },
        {
            describe: 'With Array Driver as database',
            driver: 'array'
        },
        {
            describe: 'With Mongodb Driver as database',
            driver: 'mongodb'
        }
    ].forEach((test) => {

        describe(test.describe, async () => {

            before(async () => {

                const dbinit: any = await init({ driver: test.driver, random: false });
                if (dbinit.mongod && dbinit.mongoDriver) {
                    mongod = dbinit.mongod
                    mongoDriver = dbinit.mongoDriver
                }
                loadMiddleware({ enable_decrement: true })
            });

            after(async () => {
                if (test.driver === 'mongodb') {
                    if (mongoDriver.client) await mongoDriver.client.close();
                    if (mongod) await mongod.stop();
                }
            });

            describe('getScoreBoard', async () => {
                it('Should return getScoreBoard, listType: to, scoretype: inc ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getScoreBoard('to', 'inc');
                    expect(res).to.deep.equal(scoreBoardToIncFalse);
                });

                it('Should return getScoreBoard, listType: from, scoretype: inc ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getScoreBoard('from', 'inc');
                    expect(res).to.deep.equal(scoreBoardFromIncFalse);
                });

                it('Should return getScoreBoard, listType: to, scoretype: dec ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getScoreBoard('to', 'dec');
                    expect(res).to.deep.equal(scoreBoardToDecFalse);
                });

                it('Should return getScoreBoard, listType: from, scoretype: dec ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getScoreBoard('from', 'dec');
                    expect(res).to.deep.equal(scoreBoardFromDecFalse);
                });

                it('Should return getScoreBoard, listType: to, scoretype: inc ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getScoreBoard('to', 'inc');
                    expect(res).to.deep.equal(scoreBoardToIncTrue);
                });

                it('Should return getScoreBoard, listType: from, scoretype: inc ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getScoreBoard('from', 'inc');
                    expect(res).to.deep.equal(scoreBoardFromIncTrue);
                });

                it('Should return getScoreBoard, listType: to, scoretype: dec ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getScoreBoard('to', 'dec');
                    expect(res).to.deep.equal(scoreBoardToDecTrue);
                });

                it('Should return getScoreBoard, listType: from, scoretype: dec ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getScoreBoard('from', 'dec');
                    expect(res).to.deep.equal(scoreBoardFromDecTrue);
                });


            });

            describe('getUserScore', async () => {
                it('Should return getUserScore for USER1, listType: to, scoreType: inc ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getUserScore('USER1', 'to', 'inc');
                    expect(res.score).to.equal(18)

                });

                it('Should return getUserScore for USER1, listType: to, scoreType: DEC ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getUserScore('USER1', 'to', 'dec');
                    expect(res.score).to.equal(6)
                });

                it('Should return getUserScore for USER1, listType: from, scoreType: inc ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getUserScore('USER1', 'from', 'inc');
                    expect(res.score).to.equal(26);

                });

                it('Should return getUserScore for USER1, listType: from, scoreType: DEC ( enable_decrement: false )', async () => {
                    loadMiddleware({ enable_decrement: false })
                    const res = await getUserScore('USER1', 'from', 'dec');
                    expect(res.score).to.equal(8);
                });

                it('Should return getUserScore for USER1, listType: to, scoreType: inc ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getUserScore('USER1', 'to', 'inc');
                    expect(res.score).to.equal(12);
                });

                it('Should return getUserScore for USER1, listType: to, scoreType: DEC ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getUserScore('USER1', 'to', 'dec');
                    expect(res.score).to.equal(6);
                });

                it('Should return getUserScore for USER1, listType: from, scoreType: inc ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getUserScore('USER1', 'from', 'inc');
                    expect(res.score).to.equal(26);
                });

                it('Should return getUserScore for USER1, listType: from, scoreType: DEC ( enable_decrement: true )', async () => {
                    loadMiddleware({ enable_decrement: true })
                    const res = await getUserScore('USER1', 'from', 'dec');
                    expect(res.score).to.equal(8);
                });
            })

            describe('getUserStats', async () => {
                it('Should return getUserStats for USER1', async () => {
                    const res = await getUserStats('USER1');
                    expect(res).to.deep.equal(userStatsUser1);
                });

                it('Should return getUserStats for USER2', async () => {
                    const res = await getUserStats('USER2');
                    expect(res).to.deep.equal(userStatsUser2);
                });

                it('Should return getUserStats for USER3', async () => {
                    const res = await getUserStats('USER3');
                    expect(res).to.deep.equal(userStatsUser3);
                });

                it('Should return getUserStats for USER4', async () => {
                    const res = await getUserStats('USER4');
                    expect(res).to.deep.equal(userStatsUser4);
                });
            });

            describe('givenBurritosToday', async () => {

                it('Should return givenBurritosToday stats for USER1', async () => {
                    const res = await givenBurritosToday('USER1');
                    expect(res).to.deep.equal({
                        givenToday: 9,
                        receivedToday: 6
                    });
                });

                it('Should return givenBurritosToday stats for USER2', async () => {
                    const res = await givenBurritosToday('USER2');
                    expect(res).to.deep.equal({
                        givenToday: 8,
                        receivedToday: 9
                    });
                });

                it('Should return givenBurritosToday stats for USER3', async () => {
                    const res = await givenBurritosToday('USER3');
                    expect(res).to.deep.equal({
                        givenToday: 5,
                        receivedToday: 6
                    });
                });

                it('Should return givenBurritosToday stats for USER4', async () => {
                    const res = await givenBurritosToday('USER4');
                    expect(res).to.deep.equal({
                        givenToday: 5,
                        receivedToday: 6
                    });
                });
            });
        });
    });
});
