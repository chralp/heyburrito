const log = require('bog');
const { EventEmitter } = require('events');
const database = require('../database');

class BurritoStore extends EventEmitter {
    constructor() {
        super();

        this.database = database;
    }

    givenBurritos(user) {
        return this.database.find('burritos', { from: user });
    }

    givenBurritosToday(user) {
        const start = new Date();
        const end = new Date();

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return this.database.find('burritos', { from: user, given_at: { $gte: start, $lt: end } });
    }

    giveBurrito(to, from) {
        log.info('Burrito given to %s from %s', to, from);

        return this.database.store('burritos', {
            to,
            from,
            value: 1,
            given_at: new Date(),
        }).then(() => this.emit('GIVE', to));
    }

    takeAwayBurrito(to, from) {
        log.info('Burrito taken away from %s by %s', to, from);

        return this.database.store('burritos', {
            to,
            from,
            value: -1,
            given_at:
            new Date(),
        }).then(() => this.emit('TAKE_AWAY', to));
    }

    getUserScore(user = null) {
        const match = (user) ? { to: user } : null;

        return this.database.sum('burritos', 'value', match);
    }

    getGiven(user) {
        const match = (user) ? { from: user } : null;

        return this.database.sum('burritos', 'value', match);
    }

    getGivers(user) {
        return this.database.sum('burritos', 'value', { to: user }, 'from').then(users => users.map((giver) => {
            const mappedUser = Object.assign({}, giver);

            mappedUser._id = giver.from;

            return mappedUser;
        }));
    }
}

module.exports = new BurritoStore();
