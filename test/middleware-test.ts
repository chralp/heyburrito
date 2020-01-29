import { expect } from 'chai';
import { init } from './lib/seedDatabase';


let mongod: any, mongoDriver: any
const proxyquire = require('proxyquire').noCallThru();
let getScoreBoard: any, getUserStats: any, givenBurritosToday: any

const loadMiddleware = (proxyConf = false) => {
    if (proxyConf) {
        const funcs = proxyquire('../src/middleware', { './config': { slack: { enable_decrement: false } } });
        getScoreBoard = funcs.getScoreBoard
        getUserStats = funcs.getUserStats
        givenBurritosToday = funcs.givenBurritosToday

    } else {
        const funcs = require('../src/middleware');
        getScoreBoard = funcs.getScoreBoard
        getUserStats = funcs.getUserStats
        givenBurritosToday = funcs.givenBurritosToday
    }

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
        },
    ].forEach((test) => {

        describe(test.describe, async () => {

            before(async () => {

                const dbinit: any = await init({ driver: test.driver, random: false });
                if (dbinit.mongod && dbinit.mongoDriver) {
                    mongod = dbinit.mongod
                    mongoDriver = dbinit.mongoDriver
                }
                loadMiddleware()


            });

            after(async () => {
                if (test.driver === 'mongodb') {
                    if (mongoDriver.client) await mongoDriver.client.close();
                    if (mongod) await mongod.stop();
                }
            });

            describe('getScoreBoard', async () => {
                it('Should return getScoreBoard, scoretype: inc, listType: to ( enable_decrement: false )', async () => {
                    loadMiddleware(true)
                    const res = await getScoreBoard('inc', 'to');
                    loadMiddleware()
                    expect(res).to.deep.equal([
                        {
                            username: 'USER2',
                            memberType: "member",
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 23
                        },
                        {
                            username: 'USER3',
                            memberType: "member",
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 21
                        },
                        {
                            username: 'USER1',
                            memberType: "member",
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 18
                        },
                        {
                            username: 'USER4',
                            memberType: "member",
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 16
                        }
                    ]);
                });

                it('Should return getScoreBoard, scoretype: inc, listType: to ( enable_decrement: true )', async () => {
                    const res = await getScoreBoard('inc', 'to');
                    expect(res).to.deep.equal([
                        {
                            username: 'USER2',
                            memberType: "member",
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 20
                        },
                        {
                            username: 'USER3',
                            memberType: "member",
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 13
                        },
                        {
                            username: 'USER1',
                            memberType: "member",
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 12
                        },
                        {
                            username: 'USER4',
                            memberType: "member",
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 11
                        }
                    ]);
                });

                it('Should return getScoreBoard, scoretype: inc, listType: from', async () => {
                    const res = await getScoreBoard('inc', 'from');
                    expect(res).to.deep.equal([
                        {
                            username: 'USER1',
                            memberType: "member",
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 26
                        },
                        {
                            username: 'USER4',
                            memberType: "member",
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 19
                        },
                        {
                            username: 'USER3',
                            memberType: "member",
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 18
                        },
                        {
                            username: 'USER2',
                            memberType: "member",
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 15
                        }
                    ]);
                });
                it('Should return getScoreBoard, scoretype: dec, listType: to', async () => {
                    const res = await getScoreBoard('dec', 'to');
                    expect(res).to.deep.equal([
                        {
                            username: 'USER3',
                            memberType: "member",
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 8
                        },
                        {
                            username: 'USER1',
                            memberType: "member",
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 6
                        },
                        {
                            username: 'USER4',
                            memberType: "member",
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 5
                        },
                        {
                            username: 'USER2',
                            memberType: "member",
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 3
                        }
                    ]);
                });

                it('Should return getScoreBoard, scoretype: dec, listType: from', async () => {
                    const res = await getScoreBoard('dec', 'from');
                    expect(res).to.deep.equal([
                        {
                            username: 'USER1',
                            memberType: "member",
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 8
                        },
                        {
                            username: 'USER3',
                            memberType: "member",
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 6
                        },
                        {
                            username: 'USER2',
                            memberType: "member",
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 5
                        },
                        {
                            username: 'USER4',
                            memberType: "member",
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 3
                        }
                    ]);
                });
            });

            describe('getUserStats', async () => {

                it('Should return getUserStats for USER1', async () => {
                    const res = await getUserStats('USER1');
                    expect(res).to.deep.equal({
                        user: {
                            username: 'USER1',
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            memberType: 'member',
                            receivedToday: 6,
                            givenToday: 9,
                            received: 24,
                            given: 34
                        },
                        given: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 8,
                                scoredec: 2
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 12,
                                scoredec: 4
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 6,
                                scoredec: 2
                            }
                        ],
                        received: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 5,
                                scoredec: 3
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 5,
                                scoredec: 2
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 8,
                                scoredec: 1
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 2,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 2,
                                scoredec: 0
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 3,
                                scoredec: 0
                            }
                        ]
                    });
                });
                it('Should return getUserStats for USER2', async () => {
                    const res = await getUserStats('USER2');
                    expect(res).to.deep.equal({
                        user: {
                            username: 'USER2',
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            memberType: 'member',
                            receivedToday: 9,
                            givenToday: 8,
                            received: 26,
                            given: 20
                        },
                        given: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 5,
                                scoredec: 3
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 2
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 6,
                                scoredec: 0
                            }
                        ],
                        received: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 8,
                                scoredec: 2
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 9,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 6,
                                scoredec: 0
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 1,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 3,
                                scoredec: 0
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 1,
                                scoredec: 0
                            }
                        ]
                    });
                });

                it('Should return getUserStats for USER3', async () => {
                    const res = await getUserStats('USER3');
                    expect(res).to.deep.equal({
                        user: {
                            username: 'USER3',
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            memberType: 'member',
                            receivedToday: 6,
                            givenToday: 5,
                            received: 29,
                            given: 24
                        },
                        given: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 5,
                                scoredec: 2
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 9,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 3
                            }
                        ],
                        received: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 12,
                                scoredec: 4
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 2
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 5,
                                scoredec: 2
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 0,
                                scoredec: 1
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 2,
                                scoredec: 1
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 1,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 0,
                                scoredec: 1
                            }
                        ]
                    });
                });

                it('Should return getUserStats for USER4', async () => {
                    const res = await getUserStats('USER4');

                    expect(res).to.deep.equal({
                        user: {
                            username: 'USER4',
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            memberType: 'member',
                            receivedToday: 6,
                            givenToday: 5,
                            received: 21,
                            given: 22
                        },
                        given: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 8,
                                scoredec: 1
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 6,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 5,
                                scoredec: 2
                            }
                        ],
                        received: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 6,
                                scoredec: 2
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 6,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 4,
                                scoredec: 3
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 1,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 0,
                                scoredec: 1
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 2,
                                scoredec: 0
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                memberType: 'member',
                                scoreinc: 0,
                                scoredec: 1
                            }
                        ]
                    });
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
