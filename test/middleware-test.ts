import { expect } from 'chai';
import { getScoreBoard, getUserStats, givenBurritosToday } from '../src/middleware';
import { init } from './lib/seedDatabase';
let mongod: any, mongoDriver: any;

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
            });

            after(async () => {
                if (test.driver === 'mongodb') {
                    if (mongoDriver.client) await mongoDriver.client.close();
                    if (mongod) await mongod.stop();
                }
            });

            describe('getScoreBoard', async () => {
                it('Should return getScoreBoard, scoretype: inc, listType: to', async () => {
                    const res = await getScoreBoard('inc', 'to');
                    expect(res).to.deep.equal([
                        {
                            username: 'USER2',
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 23
                        },
                        {
                            username: 'USER3',
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 21
                        },
                        {
                            username: 'USER1',
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 18
                        },
                        {
                            username: 'USER4',
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 16
                        }
                    ]);
                });

                it('Should return getScoreBoard, scoretype: inc, listType: from', async () => {
                    const res = await getScoreBoard('inc', 'from');
                    expect(res).to.deep.equal([
                        {
                            username: 'USER1',
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 26
                        },
                        {
                            username: 'USER4',
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 19
                        },
                        {
                            username: 'USER3',
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 18
                        },
                        {
                            username: 'USER2',
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
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 8
                        },
                        {
                            username: 'USER1',
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 6
                        },
                        {
                            username: 'USER4',
                            name: 'User4',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 5
                        },
                        {
                            username: 'USER2',
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
                            name: 'User1',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 8
                        },
                        {
                            username: 'USER3',
                            name: 'User3',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 6
                        },
                        {
                            username: 'USER2',
                            name: 'User2',
                            avatar: 'https://link.to.avatar.48.burrito',
                            score: 5
                        },
                        {
                            username: 'USER4',
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
                                scoreinc: 8,
                                scoredec: 2
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 12,
                                scoredec: 4
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 6,
                                scoredec: 2
                            }
                        ],
                        received: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 5,
                                scoredec: 3
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 5,
                                scoredec: 2
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 8,
                                scoredec: 1
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 2,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 2,
                                scoredec: 0
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
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
                                scoreinc: 5,
                                scoredec: 3
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 2
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 6,
                                scoredec: 0
                            }
                        ],
                        received: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 8,
                                scoredec: 2
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 9,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 6,
                                scoredec: 0
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 1,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 3,
                                scoredec: 0
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
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
                                scoreinc: 5,
                                scoredec: 2
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 9,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 3
                            }
                        ],
                        received: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 12,
                                scoredec: 4
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 2
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 5,
                                scoredec: 2
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 0
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 0,
                                scoredec: 1
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 2,
                                scoredec: 1
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 1,
                                scoredec: 1
                            },
                            {
                                username: 'USER4',
                                name: 'User4',
                                avatar: 'https://link.to.avatar.48.burrito',
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
                                scoreinc: 8,
                                scoredec: 1
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 6,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 5,
                                scoredec: 2
                            }
                        ],
                        received: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 6,
                                scoredec: 2
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 6,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 4,
                                scoredec: 3
                            }
                        ],
                        givenToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 1,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 0,
                                scoredec: 1
                            }
                        ],
                        receivedToday: [
                            {
                                username: 'USER1',
                                name: 'User1',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 2,
                                scoredec: 0
                            },
                            {
                                username: 'USER2',
                                name: 'User2',
                                avatar: 'https://link.to.avatar.48.burrito',
                                scoreinc: 3,
                                scoredec: 0
                            },
                            {
                                username: 'USER3',
                                name: 'User3',
                                avatar: 'https://link.to.avatar.48.burrito',
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
