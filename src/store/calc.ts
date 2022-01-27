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
  const valueSwitch = (scoreType === 'dec') ? 1 : 0;
  console.log("aaa", data)
  console.log("valueSwitch", valueSwitch)
  console.log(listType, scoreType, user)

  const { enableOverDraw } = config.slack;


  const _dataOverDrawn = overDrawnData.filter((entry: DatabasePost) => {

    if (enableOverDraw) {
      /**
       * Just ensure that we filter out correct user data if user is present
       */
      const list = listType === 'to' ? listTypeSwitch(listType) : listType;
      if (listType !== 'from') {
        if (user && entry[list] === user && !!entry.overdrawn) {
          return entry;
        }
      }
    }
  });

  const _scoreOverdrawn = _dataOverDrawn.reduce((total: number, current: DatabasePost): number => {
    return total + current.value;
  }, 0);

  console.log("_scoreOverdrawn", _scoreOverdrawn)
  const _score = data.reduce((total: number, current: DatabasePost): number => {

    /**
     * enableDecrement = true
     * calc:
     * all values beside overdrawn?
     */

    if (config.slack.enableDecrement) {

      if (listType && user && current[listType] === user) {

        if (enableOverDraw) {
          if (current.overdrawn) {
            return total + current.value;
          }
          return total;
        }


        if(listType === 'from' && scoreType === 'inc' && current.value === 1) {
          return total + current.value

        }else if(listType === 'to' && scoreType === 'inc') {
          return total + current.value

        }else {
          return total;
        }


        // THIS SEAMS TO WORK
        if (!current.overdrawn) return total + current.value;
      }
      return total;
    }

    /**
     * enableDecrement = false
     * calc:
     * only postive number
     */
    if (!config.slack.enableDecrement) {

      if (listType && user && current[listType] === user) {


        if(listType === 'to' && scoreType === 'dec') {
          if(current.value === -1){
            return total + 1;
          } else {
            return total;
          }
        }


        if (enableOverDraw && current.overdrawn) {
          // Is this right??
          return total + current.value;
        }



        if (current.value === 1 && !current.overdrawn) return total + current.value;
        return total;
      }
      return total;
    }
  }, 0);
  console.log("_score", _score)
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


}
