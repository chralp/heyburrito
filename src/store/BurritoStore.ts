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

    async giveBurrito(to: string, from: string): Promise<string> {
        log.info(`Burrito given to ${to} from ${from}`);
        await this.database.give(to, from);
        this.emit('GIVE', to);
        return to;
    }

    async takeAwayBurrito(to: string, from: string): Promise<string | []> {
        log.info(`Burrito taken away from ${to} by ${from}`);
        const score: number = await this.database.getScore(to, 'to', true);
        if (!score) return [];
        await this.database.takeAway(to, from);
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
        const { user, listType, scoreType } = args;
        const data = await this.database.getScoreBoard({ ...args });
        const score = [];
        const uniqueUsername = [...new Set(data.map((x) => x[listType]))];
        uniqueUsername.forEach((u) => {
            if (user) {
                const dataByUser = data.filter((e: any) => e[listType] === u);
                const scoreinc = dataByUser.filter((x: any) => x.value === 1);
                const scoredec = dataByUser.filter((x: any) => x.value === -1);
                score.push({
                    _id: u,
                    scoreinc: scoreinc.length,
                    scoredec: scoredec.length,
                });
            } else {
                const scoreTypeFilter = (scoreType === 'inc') ? 1 : -1;
                const dataByUser = data.filter((e: any) => (e[listType] === u && e.value === scoreTypeFilter));
                const red = dataByUser.reduce((a: number, item) => {
                    const value = (item.value === -1) ? 1 : 1;
                    return a + value;
                }, 0);
                score.push({ _id: u, score: red });
            }
        });
        return score;
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
