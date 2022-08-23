import log from 'loglevel';
import { EventEmitter } from 'events';
import config from '../config';
import { listTypeSwitch } from '../lib/utils/switch';
import { calculateScore } from './calc';
import { Updates } from '../lib/parseMessage';
import Driver, {
  GetScoreBoard,
  DatabasePost,
} from '../database/drivers/Driver';

interface GetUserStats {
  _id: string;
  received: number;
  given: number;
  receivedToday: number;
  givenToday: number;
}

class BurritoStore extends EventEmitter {

  database: Driver;

  // Set and Store database object
  public setDatabase(database: Driver) {
    this.database = database;
  };

  public async give({ to, from, type, overdrawn }: Updates): Promise<string> {
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
      received: calculateScore(received, [], {}),
      given: calculateScore(given, [], {})
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
          if (overdrawn) return !!x.overdrawn
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

    const { enableOverDraw } = config.slack
    // Get users score from DB, ( Only all inc not calculated with dec or overdrwan)
    const data = await this.database.getScore(user, listType);
    const _data = enableOverDraw ? await this.database.getScore(user, listTypeSwitch(listType)) : [];
    return calculateScore(data, _data, { listType, scoreType, user });

  };

}

export default new BurritoStore();
