import { default as log } from 'bog';
import { EventEmitter } from 'events';
import UserScoreInterface from '../types/UserScore.interface';

class BurritoStore extends EventEmitter {

    database: any = null;

    setDatabase(database) {
        this.database = database;
    }

    givenBurritos(user: string) {
        return this.database.findFrom(user);
    }

    givenBurritosToday(user: string) {
        return this.database.findFromToday(user);
    }

    giveBurrito(to: string, from: string) {
        log.info(`Burrito given to ${to} from ${from}`);
        return this.database.give(to, from).then(() => this.emit('GIVE', to));
    }

    async takeAwayBurrito(to: string, from: string) {
        log.info(`Burrito taken away from ${to} by ${from}`);
        const data = await this.getUserScore({ user: to });

        // Loweset score possible should be 0 ( ZERO )
        const score = data.map(x => x.score)[0]

        if (!score) return []

        if (score > 0) return this.database.takeAway(to, from).then(() => this.emit('TAKE_AWAY', to));
    }

    async getUserStats(user: string) {
        const [score, given, givenTodayArr] = await Promise.all([
            this.database.getScore({ user, scoreType: 'to' }),
            this.database.getGiven(user),
            this.database.findFromToday(user)
        ])

        // Always return something
        const givenTotal = given.length ? given.reduce((acc, current) => ({ score: acc.score + current.score })) : { score: 0 }
        score.push({
            givenTotal: givenTotal.score,
            givenToday: Object.keys(givenTodayArr).length
        })

        const merged = score.reduce((acc, current) => Object.assign({}, acc, current))
        return [merged];
    }

    async getUserScore({ user = null, scoreType = null }): Promise<Array<UserScoreInterface>> {
        const data = user ? this.getUserStats(user) : this.database.getScore({ user, scoreType });
        return data;
    }

    getGiven(user: string): Promise<Array<UserScoreInterface>> {
        return this.database.getGiven(user);
    }


    getGivers(user: string = null): Promise<Array<UserScoreInterface>> {
        return this.database.getGivers(user);
    }

    getUserScoreList({ ...args }): Promise<Array<UserScoreInterface>> {
        return this.database.getUserScoreList(args);
    }

}

// Export as singleton
export default new BurritoStore();
