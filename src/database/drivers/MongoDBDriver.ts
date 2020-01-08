import { time } from '../../lib/utils';

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


export default class MongoDBDriver {
    constructor(
        public MongoClient: any,
        public config: any = {},
        public client = null,
        public db = null,
    ) { }

    connect() {
        if (this.client && typeof this.client.isConnected === 'function' && this.client.isConnected()) {
            return Promise.resolve(this.client);
        }
        return this.MongoClient.connect(`${this.config.url}/${this.config.database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((client: any) => {
            this.client = client;
            this.db = client.db(this.config.database);
        });
    }

    async store(collection: string, data: Object) {
        await this.connect();
        if (Array.isArray(data)) {
            return this.db.collection(collection).insertMany(data);
        }
        return this.db.collection(collection).insertOne(data);
    }

    /**
     * @param { string } collection -  like burrito
     * @param { Object } query - searchObject to search for
     * @return { Find[] }
     */
    async find(collection: string, query: Object): Promise<Find[]> {
        await this.connect();
        return this.db.collection(collection).find(query).toArray();
    }

    /**
     * @param { string } collection - burrito / rottenburrito
     * @param { string } key - defaults to value
     * @param { string | null } match - matchObject to search for
     * @param { string } groupby - defaults to 'to'
     * @return { Object } sum[] - data
     */
    async sum(collection: string, key: string = 'value', match: Object = null, groupBy: string = 'to'): Promise<Sum[]> {
        await this.connect();
        const aggregations: Array<Object> = [{ $match: { to: { $exists: true } } }];
        if (match) {
            aggregations.push({ $match: match });
        }
        aggregations.push({ $group: { _id: `$${groupBy}`, score: { $sum: `$${key}` } } });
        aggregations.push({ $sort: { score: -1 } });
        return this.db.collection(collection).aggregate(aggregations).toArray();
    }

    /**
     * Finds all entrys associated to user today
     * @params { string } user => userid
     * @params { string } listtype => to / from
     * @returns {Find[]}
     */
    findFromToday(user: string, listType: string): Promise<Find[]> {
        return this.find('burritos', {
            [listType]: user,
            given_at: {
                $gte: time().start,
                $lt: time().end,
            },
        });
    }

    /**
     * Return specific userScore
     * @param {string} user - userId
     * @param {string} listType - to / from
     * @return {Object} sum[]
     */
    getScore(user: string, listType: string): Promise<Sum[]> {
        const match = (user) ? { [listType]: user } : null;
        return this.sum('burritos', 'value', match, listType);
    }

    /**
     * Returns scoreboard
     * Should be able to return burrito List ( scoreType inc ) and
     * listtype ( dec ) AKA rottenburritoList
     */
    async getScoreBoard({ user, listType, today }): Promise<Sum[]> {
        let match: any = {};
        if (user) {
            match = (listType === 'from') ? { to: user } : { from: user };
        }
        if (today) {
            match.given_at = { $gte: time().start, $lt: time().end };
        }
        return this.sum('burritos', 'value', match, listType);
    }

    give(to: string, from: string) {
        return this.store('burritos', {
            to,
            from,
            value: 1,
            given_at: new Date(),
        });
    }

    takeAway(to: string, from: string) {
        return this.store('burritos', {
            to,
            from,
            value: -1,
            given_at: new Date(),
        });
    }
}
