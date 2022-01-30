import log from 'loglevel';
import { EventEmitter } from 'events';
import config from '../config';
import { listTypeSwitch } from '../lib/utils/switch';
import {calculateScore} from './calc';
import Driver, {
  GetScoreBoard,
  DatabasePost,
} from '../database/drivers/Driver';


interface CalucateUserScore {
  listType?: string;
  scoreType?: string;
  user?: string;
}

interface GetUserStats {
  _id: string;
  received: number;
  given: number;
  receivedToday: number;
  givenToday: number;
}

interface BurritoUpdate {
  to: string;
  from: string;
  type: string;
  overdrawn?: boolean;
}

class BurritoStore extends EventEmitter {

  database: Driver;

  // Set and Store database object
  public setDatabase(database: Driver) {
    this.database = database;
  };

  public async give({ to, from, type, overdrawn }: BurritoUpdate): Promise<string> {
    const score = {
      to,
      from,
      value: (type === 'inc') ? 1 : -1,
      given_at: new Date(),
      overdrawn,
    };

    await this.database.give(score);

    if (type === 'inc') {
      log.info(`Burrito given to ${to} from ${from}`);
      this.emit('GIVE', to, from);
    };

    if (type === 'dec') {
      log.info(`Burrito taken away from ${to} by ${from}`);
      this.emit('TAKE_AWAY', to, from);
    };

    if (overdrawn) this.emit('TAKE_AWAY', to, from);
    return to;
  };

  public async getUserStats(user: string): Promise<GetUserStats> {
    const [
      received,
      given,
      receivedToday,
      givenToday,
    ] = await Promise.all([
      this.database.getScore(user, 'to'),
      this.database.getScore(user, 'from'),
      this.givenToday(user, 'to'),
      this.givenToday(user, 'from'),
    ]);
    return {
      receivedToday,
      givenToday,
      _id: user,
      received: calculateScore(received, [],{}),
      given: calculateScore(given, [],{})
    };
  };

  public getScoreBoard(args: GetScoreBoard) {
    return this.database.getScoreBoard(args);
  };

  public async givenToday(user: string, listType: string, scoreType?: string, overdrawn: boolean = false): Promise<number> {

    const givenToday = await this.database.findFromToday(user, listType);
    if (scoreType && ['inc', 'dec'].includes(scoreType)) {
      const scoreTypeFilter = (scoreType === 'inc') ? 1 : -1;

      const givenFilter = givenToday.filter((x) => {
        if (x.value === scoreTypeFilter) {
          if(overdrawn) return !!x.overdrawn
          return !x.overdrawn
        };
      });
      return calculateScore(givenFilter, [], { listType, scoreType, user });
    };
    return calculateScore(givenToday, [], { listType, scoreType, user });
  };




  /**
   * Get UserScore depending on listType and scoreType.
   */
  public async getUserScore(user: string, listType: string, scoreType: string): Promise<number> {

    const { enableDecrement, enableOverDraw } = config.slack
    console.log("INSIDE", enableOverDraw, enableDecrement)
    // Get users score from DB, ( Only all inc not calculated with dec or overdrwan)
    const _data = await this.database.getScore(user, listType);
    if (enableOverDraw) {
      const _dataSwitched = await this.database.getScore(user, listTypeSwitch(listType));
      const data = _dataSwitched.filter((entry) => (!!entry.overdrawn));
      return calculateScore(_data, [], { listType, scoreType, user });
    }
    return calculateScore(_data, [], { listType, scoreType, user });

  };


  public filterScoreData(data: DatabasePost[], scoreType: string) {

    const scoreSwitch = (scoreType === 'inc') ? 1 : -1;
    const valueSwitch = (scoreType === 'dec') ? 1 : 0;

    return data.filter((entry) => {
      if (config.slack.enableDecrement) {
        if (!config.slack.enableOverDraw) {
          return valueSwitch
            ? (entry.overdrawn !== true && entry.value === scoreSwitch)
            : entry.overdrawn !== true;
        } else {
          return valueSwitch ? entry.value === scoreSwitch : entry;
        }
      } else {
        if (entry.value == scoreSwitch) {
          if (config.slack.enableOverDraw) return entry;
          return entry.overdrawn !== true;
        }
      }
    });
  };
}

export default new BurritoStore();
