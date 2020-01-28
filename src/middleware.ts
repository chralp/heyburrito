import { sort } from './lib/utils';
import mapper from './lib/mapper';
import BurritoStore from './store/BurritoStore';

/**
 * Middleware for API and Websocket
 */

/**
 * @param {string} scoretype - inc / dec
 * @param {string} listType - to / from
 */
const getScoreBoard = async (scoreType: string, listType: string) => {
    const scoreList = await BurritoStore.getScoreBoard({ listType, scoreType });
    return sort(mapper(scoreList));
};

/**
 * @param {string} user - Slack userId
 */
const getUserStats = async (user: string) => {
    const [
        userStats,
        givenList,
        receivedList,
        givenListToday,
        receivedListToday,
    ] = await Promise.all([
        BurritoStore.getUserStats(user),
        BurritoStore.getUserScoreBoard({ user, listType: 'to' }),
        BurritoStore.getUserScoreBoard({ user, listType: 'from' }),
        BurritoStore.getUserScoreBoard({ user, listType: 'to', today: true }),
        BurritoStore.getUserScoreBoard({ user, listType: 'from', today: true }),
    ]);

    return {
        user: mapper([userStats])[0],
        given: sort(mapper(givenList)),
        received: sort(mapper(receivedList)),
        givenToday: sort(mapper(givenListToday)),
        receivedToday: sort(mapper(receivedListToday)),
    };
};

/**
 * @param {string} user - Slack userId
 */
const givenBurritosToday = async (user: string) => {
    const [
        receivedToday,
        givenToday,
    ] = await Promise.all([
        BurritoStore.givenBurritosToday(user, 'to'),
        BurritoStore.givenBurritosToday(user, 'from'),
    ]);

    return {
        givenToday,
        receivedToday,
    };
};


/**
 * @param {string} user - Slack userId
 */
const getUserScore = async (user: string, listType: string, scoreType: string) => {
    const scoreList = await BurritoStore.getScoreBoard({ listType, scoreType });
    const userScore = scoreList.filter((x) => x._id === user);
    console.log(user, listType, scoreType, scoreList, userScore)
    const [res] = mapper(userScore);
    return {
        ...res,
        scoreType
    };
};

export {
    getScoreBoard,
    getUserStats,
    givenBurritosToday,
    getUserScore,
};
