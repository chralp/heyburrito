import * as log from 'bog';
import { EventEmitter } from 'events';

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

interface DatabasePost {
    _id: string,
    to: string,
    from: string,
    value: number,
    given_at: Date
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

    async getScoreBoard({ ...args }): Promise<DatabasePost[]> {
        return this.database.getScoreBoard({ ...args });
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
     * @param {string} listType - to / from defaults from
     */
    async givenToday(user: string, listType: string, type: any = false): Promise<number> {
        const givenToday: Find[] = await this.database.findFromToday(user, listType);
        if (type) {
            if (['inc', 'dec'].includes(type)) {
                const valueFilter = (type === 'inc') ? 1 : -1;
                const givenFilter = givenToday.filter((x) => x.value === valueFilter);
                return givenFilter.length;
            }
        }
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
