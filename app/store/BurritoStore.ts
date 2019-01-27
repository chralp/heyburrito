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
        return this.getUserScore(to).then((data) => {

            // Loweset score possible should be 0 ( ZERO )
            const score = data.map(x => x.score)[0]

            if (!score) return []

            if (score > 0) {
                return this.database.takeAway(to, from).then(() => this.emit('TAKE_AWAY', to));
            }
        })
    }

    getUserScore(user: string = null): Promise<Array<UserScoreInterface>> {
        return this.database.getScore(user);
    }

    getGiven(user: string): Promise<Array<UserScoreInterface>> {
        return this.database.getGiven(user);
    }

    getGivers(user: string): Promise<Array<UserScoreInterface>> {
        return this.database.getGivers(user);
    }
}

// Export as singleton
export default new BurritoStore();
