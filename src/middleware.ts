import config from './config';
import mapper from './lib/mapper';
import { sort } from './lib/utils';
import BurritoStore from './store/BurritoStore';

/**
 * Middleware for API and Websocket
 */

/**
 * @param {string} scoretype - inc / dec
 * @param {string} listType - to / from
 */
const getScoreBoard = async (scoreType: string, listType: string) => {
    const data = await BurritoStore.getScoreBoard({ listType, scoreType });

    const score = [];
    const uniqueUsername = [...new Set(data.map((x) => x[listType]))];

    const scoreTypeFilter = (scoreType === 'inc') ? 1 : -1;

    uniqueUsername.forEach((u) => {
        const dataByUser = data.filter((e: any) => (e[listType] === u));
        let filteredData: any;
        let countSwitch: any;

        if (listType === 'to' && config.slack.enable_decrement && (scoreType === 'inc')) {
            filteredData = dataByUser;
        } else {
            filteredData = dataByUser.filter((e: any) => (e.value === scoreTypeFilter));
            countSwitch = 1;
        }
        const red = filteredData.reduce((a: number, item) => a + (countSwitch || item.value), 0);
        score.push({ _id: u, score: red });
    });
    const scoreList = score.map((x) => {
        if (x.score !== 0) return x;
        return undefined;
    }).filter((y) => y);
    return sort(mapper(scoreList));
};


const getUserScoreBoard = async ({ ...args }) => {
    const { listType } = args;
    const data: any = await BurritoStore.getScoreBoard({ ...args });
    const score = [];
    const uniqueUsername = [...new Set(data.map((x) => x[listType]))];
    uniqueUsername.forEach((u) => {
        const dataByUser = data.filter((e: any) => e[listType] === u);
        const scoreinc = dataByUser.filter((x: any) => x.value === 1);
        const scoredec = dataByUser.filter((x: any) => x.value === -1);
        score.push({
            _id: u,
            scoreinc: scoreinc.length,
            scoredec: scoredec.length,
        });
    });
    return score;
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
        getUserScoreBoard({ user, listType: 'to' }),
        getUserScoreBoard({ user, listType: 'from' }),
        getUserScoreBoard({ user, listType: 'to', today: true }),
        getUserScoreBoard({ user, listType: 'from', today: true }),
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
    const [res] = mapper(userScore);
    return {
        ...res,
        scoreType,
    };
};

export {
    getScoreBoard,
    getUserStats,
    givenBurritosToday,
    getUserScore,
};
