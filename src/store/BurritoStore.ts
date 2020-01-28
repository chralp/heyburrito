import * as log from 'bog';
import { EventEmitter } from 'events';
import config from '../config';

interface Find {
    _id: string;
    to: string;
    from: string;
    value: number;
    given_at: Date;
}

interface Sum {
    _id?: string; // Username
    score?: number;
}

interface GetUserStats {
    _id: string;
    received: number;
    given: number;
    receivedToday: number;
    givenToday: number;
}

interface GetScoreBoard {
    listType: string;
    scoreType?: string;
    user?: string;
    fromDate?: string;
    toDate?: string;
    today?: boolean;
}

class BurritoStore extends EventEmitter {
    database: any = null;

    // Set and Store database object
    setDatabase(database: any) {
        this.database = database;
    }

    async giveBurrito(to: string, from: string, date = new Date()): Promise<string> {
        log.info(`Burrito given to ${to} from ${from}`);
        await this.database.give(to, from, date);
        this.emit('GIVE', to, from);
        return to;
    }

    async takeAwayBurrito(to: string, from: string, date = new Date()): Promise<string | []> {
        log.info(`Burrito taken away from ${to} by ${from}`);
        const score: number = await this.database.getScore(to, 'to', true);
        if (!score) return [];
        await this.database.takeAway(to, from, date);
        this.emit('TAKE_AWAY', to, from);
        return to;
    }

    async getUserStats(user: string): Promise<GetUserStats> {
        const [
            received,
            given,
            receivedToday,
            givenToday,
        ]: [Sum[], Sum[], number, number] = await Promise.all([
            this.database.getScore(user, 'to'),
            this.database.getScore(user, 'from'),
            this.givenBurritosToday(user, 'to'),
            this.givenBurritosToday(user, 'from'),
        ]);
        return {
            receivedToday,
            givenToday,
            _id: user,
            received: received.length,
            given: given.length,
        };
    }

    async getScoreBoard({ ...args }: GetScoreBoard) {
        const { listType, scoreType } = args;
        const data = await this.database.getScoreBoard({ ...args });
        const score = [];
        const uniqueUsername = [...new Set(data.map((x) => x[listType]))];

        const { enable_decrement } = config.slack

        const scoreTypeFilter = (scoreType === 'inc') ? 1 : -1;

        uniqueUsername.forEach((u) => {
            const dataByUser = data.filter((e: any) => (e[listType] === u));
            let filteredData: any;
            let countSwitch: any;

            if (listType === 'to' && enable_decrement && (scoreType === 'inc')) {
                filteredData = dataByUser

            } else {
                filteredData = dataByUser.filter((e: any) => (e.value === scoreTypeFilter));
                countSwitch = 1
            }
            const red = filteredData.reduce((a: number, item) => {
                return a + (countSwitch || item.value);
            }, 0);
            score.push({ _id: u, score: red });
        });

        const scoreList = score.map(x => {
            if (x.score != 0) return x
            return undefined
        }).filter(y => y)
        return scoreList;
    }

    async getUserScoreBoard({ ...args }: GetScoreBoard) {
        const { listType } = args;
        const data = await this.database.getScoreBoard({ ...args });
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
    }


    /**
     * @param {string} user - userId
     * @param {string} listType - to / from defaults from
     */
    async givenBurritosToday(user: string, listType: string): Promise<number> {
        const givenToday: Find[] = await this.database.findFromToday(user, listType);
        return givenToday.length;
    }

    /**
     * @param {string} user - userId
     */
    async getUserScore(user: string, listType: string, num): Promise<number> {
        return this.database.getScore(user, listType, num);
    }
}

export default new BurritoStore();
