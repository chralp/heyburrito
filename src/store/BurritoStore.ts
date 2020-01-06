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
    gived: number;
    receivedToday: number;
    givedToday: number;
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
    setDatabase(database: any): void {
        this.database = database;
    }

    async giveBurrito(to: string, from: string) {
        log.info(`Burrito given to ${to} from ${from}`);
        await this.database.give(to, from);
        return this.emit('GIVE', to);
    }

    async takeAwayBurrito(to: string, from: string) {
        log.info(`Burrito taken away from ${to} by ${from}`);
        const data: Sum[] = await this.database.getScore(to, 'to');
        const score: number | undefined = data.map((x: Sum) => x.score)[0];
        if (!score) return [];
        await this.database.takeAway(to, from);
        return this.emit('TAKE_AWAY', to);
    }

    async getUserStats(user: string): Promise<GetUserStats> {
        const [
            received,
            gived,
            receivedToday,
            givedToday,
        ]: [Sum[], Sum[], number, number] = await Promise.all([
            this.database.getScore(user, 'to'),
            this.database.getScore(user, 'from'),
            this.givenBurritosToday(user, 'to'),
            this.givenBurritosToday(user, 'from'),
        ]);
        return {
            receivedToday,
            givedToday,
            _id: user,
            received: received.length ? received[0].score : 0,
            gived: gived.length ? gived[0].score : 0,
        };
    }

    async getScoreBoard(args: GetScoreBoard): Promise<Sum[]> {
        return this.database.getScoreBoard(args);
    }

    /**
     * @param {string} user - userId
     * @param {string} listType - to / from defaults from
     */
    async givenBurritosToday(user: string, listType: string = 'from'): Promise<number> {
        const givenToday: Find[] = await this.database.findFromToday(user, listType);
        return givenToday.length;
    }
}

export default new BurritoStore();
