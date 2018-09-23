import log from 'bog'

import EventEmitter from 'events'

class BurritoStore extends EventEmitter {

    database:any
    constructor() {
        super();
        this.database = null;
    }

    setDatabase(database) {
        this.database = database;
    }

    givenBurritos(user) {
        return this.database.findFrom(user);
    }

    givenBurritosToday(user) {
        return this.database.findFromToday(user);
    }

    giveBurrito(to, from) {
        log.info('Burrito given to %s from %s', to, from);

        return this.database.give(to, from).then(() => this.emit('GIVE', to));
    }

    takeAwayBurrito(to, from) {
        log.info('Burrito taken away from %s by %s', to, from);

        return this.database.takeAway(to, from).then(() => this.emit('TAKE_AWAY', to));
    }

    getUserScore(user = null) {
        console.log("SAATANS")
        return this.database.getScore(user);
    }

    getGiven(user) {
        return this.database.getGiven(user);
    }

    getGivers(user) {
        return this.database.getGivers(user);
    }
}

// Export as singleton
export default new BurritoStore();
