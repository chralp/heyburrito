import config from '../config';
import { listTypeSwitch } from '../lib/utils';
import { DatabasePost } from '../database/drivers/Driver';

interface CalculateScoreArgs {
  listType?: string;
  scoreType?: string;
  user?: string;
  countOverDrawn?: boolean;
}

/**
 * Since ive added some features as levelUp and overdrawn and decrement
 * adding code to calulate this everywhere makes no sense. And depening on ENVS
 * makes everything harder.
 * Trying to add add dumb calculations in this file
 */
export const calculateScore = (data: DatabasePost[], overDrawnData?: DatabasePost[], args?: CalculateScoreArgs): number => {
  const { listType, scoreType, user } = args;
  const { enableOverDraw, enableDecrement } = config.slack;

  const _dataOverDrawn = overDrawnData.filter((entry: DatabasePost) => {

    // Just ensure that we filter out correct user data if user is present
    const list = listType === 'to' ? listTypeSwitch(listType) : listType;
    if (listType !== 'from' && user && enableOverDraw && entry[list] === user && !!entry.overdrawn) {
      return entry;
    }
  });

  const _scoreOverdrawn = _dataOverDrawn.reduce((total: number, current: DatabasePost): number => {
    return total + current.value;
  }, 0);

  const _score = data.reduce((total: number, current: DatabasePost): number => {

    // We only want to handle the correct user data depending on current[listType] === USER
    if (!(current[listType] === user)) return total;

    /**
     * We want to calculate the score differently
     * depending on listType and scoreType.
     * Main scoreBoard: listType === 'to' && scoreType === 'inc'
     * This scoreBoard should take into account if decrement or overdrawn is enabled or not.
     */
    if (listType === 'to' && scoreType === 'inc') {

      // Just count everything
      if (enableOverDraw && enableDecrement) return total + current.value;


      if (enableOverDraw) {
        if (current.value !== -1) return total + current.value;
        return total;
      };

      if (enableDecrement) {
        if (!current.overdrawn) return total + current.value;
        return total;
      };

      // Ensure we only return positive value and that current.overdrawn is false
      if (current.value === 1 && !current.overdrawn) return total + current.value;
      return total;
    };


    /**
     * scoreBoard: listType === 'from' && scoreType === 'inc'
     * This scoreBoard should not count -1 values. Only return postive values
     */
    if (listType === 'from' && scoreType === 'inc') {

      if (enableOverDraw && enableDecrement || enableOverDraw) {
        if (current.value !== -1) return total + current.value;
        return total;
      }

      if (current.value === 1 && !current.overdrawn) return total + current.value;
      return total;
    };

    /**
     * Only match -1 values and return 1 instead
     */
    if (listType === 'from' || listType === 'to' && scoreType === 'dec') {
      if (current.value == -1) return total + 1;
      return total;
    };

    return total;
  }, 0);

  return _score - _scoreOverdrawn;
};


export const levelScoreList = (scoreList: any) => {
  const data = scoreList.map((x: any) => {
    const { scoreRotation } = config.level;
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
  return data;
};
