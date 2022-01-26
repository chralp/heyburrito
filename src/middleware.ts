import config from './config';
import mapper from './lib/mapper';
import { sort } from './lib/utils';
import BurritoStore from './store/BurritoStore';

const {
  level: {
    enableLevel,
    scoreRotation,
  },
  slack: {
    enableOverDraw,
    enableDecrement,
  }
} = config;



export const listTypeSwitch = (listType: string) => listType === 'to' ? 'from' : 'to';


const levelScoreList = (scoreList) => scoreList.map((x: any) => {
  let score = x.score;
  const roundedScore = Math.floor(score / scoreRotation) * scoreRotation;
  const level = Math.floor((score - 1) / scoreRotation);
  const newScore = ((score - roundedScore) === 0 ? roundedScore - (score - scoreRotation) : score - roundedScore);
  return {
    _id: x._id,
    score: newScore,
    level,
  }
});

/**
 * Middleware for API and Websocket
 */

/**
 * @param {string} scoretype - inc / dec
 * @param {string} listType - to / from
 */
const getScoreBoard = async (listType: string, scoreType: string) => {

  const _data = await BurritoStore.getScoreBoard({ listType });

  // We want to filter out data that we want first
  const data = BurritoStore.filterScoreData(_data, scoreType);

  // Get unique Usernames
  const uniqueUsername: string[] = [...new Set(data.map((x) => x[listType]))];

  const scoreList = uniqueUsername
    .map((user) => ({ _id: user, score: BurritoStore._calucateScore(data, user, { listType, scoreType }) }))
    .map((entry) => (entry.score !== 0) ? entry : null).filter(y => y);

  return enableLevel ? sort(mapper(levelScoreList(scoreList))) : sort(mapper(scoreList));
};

const _getUserScoreBoard = async ({ ...args }) => {
  const { listType, user, today } = args;
  const data = await BurritoStore.getScoreBoard({ listType, user, today });
  const score = [];
  const uniqueUsername: string[] = [...new Set(data.map((x) => x[listType]))];
  uniqueUsername.forEach((u) => {
    const dataByUser = data.filter((e: any) => e[listType] === u);
    const scoreinc = dataByUser.filter((x: any) => ((x.value === 1) && (x.overdrawn !== true)));
    const scoredec = dataByUser.filter((x: any) => ((x.value === -1) && (x.overdrawn !== true)));
    const scoreincOverdrawn = dataByUser.filter((x) => ((x.value === 1) && (x.overdrawn == true)));
    const scoredecOverdrawn = dataByUser.filter((x) => ((x.value === -1) && (x.overdrawn == true)));
    score.push({
      _id: u,
      scoreinc: scoreinc.length,
      scoredec: scoredec.length,
      scoreincOverdrawn: scoreincOverdrawn.length,
      scoredecOverdrawn: scoredecOverdrawn.length,
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
    _getUserScoreBoard({ user, listType: 'to' }),
    _getUserScoreBoard({ user, listType: 'from' }),
    _getUserScoreBoard({ user, listType: 'to', today: true }),
    _getUserScoreBoard({ user, listType: 'from', today: true }),
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
    BurritoStore.givenToday(user, 'to'),
    BurritoStore.givenToday(user, 'from'),
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
  console.log("HAALÅÅÅ")
  const scoreList = await BurritoStore.getScoreBoard({ listType });
  const userScore = scoreList.filter((x) => x[listType] === user);

  const scoreTypeFilter = (scoreType === 'inc') ? 1 : -1;
  let countSwitch: any;
  let filteredData: any;

  if (listType === 'to' && scoreType === 'inc') {
    if (config.slack.enableDecrement) {
      filteredData = userScore;
    } else {
      filteredData = userScore.filter((e: any) => (e.value === scoreTypeFilter));
      countSwitch = 1;
    }
  } else {
    filteredData = userScore.filter((e: any) => (e.value === scoreTypeFilter));
    if (scoreType === 'dec') {
      countSwitch = 1;
    }
  }
  const userScoreCounted = filteredData.reduce((acc, item) => acc + (countSwitch || item.value), 0);
  const [res] = mapper([{
    _id: user,
    score: userScoreCounted,
  }]);
  return {
    ...res,
    scoreType,
    listType,
  };
};

export {
  getScoreBoard,
  getUserStats,
  givenBurritosToday,
  getUserScore,
};
