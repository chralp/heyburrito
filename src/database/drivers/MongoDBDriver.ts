import { time } from '../../lib/utils';

const mongoConf = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

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

class MongoDBDriver {
    constructor(
        public MongoClient: any,
        public conf: any = {},
        public client = null,
        public db = null,
    ) { }

    async connect() {
        if (this.client && this.client.isConnected()) {
            return this.client;
        }

        try {
            const client = await this.MongoClient.connect(`${this.conf.db_uri}`, mongoConf);
            this.client = client;
            this.db = client.db(this.conf.db_database);
            return true;
        } catch (e) {
            throw new Error('Could not connect to Mongodb server');
        }
    }

    async store(collection: string, data: Object) {
        await this.connect();
        return this.db.collection(collection).insertOne(data);
    }

    give(to: string, from: string, date: any) {
        return this.store('burritos', {
            to,
            from,
            value: 1,
            given_at: date,
        });
    }

    takeAway(to: string, from: string, date: any) {
        return this.store('burritos', {
            to,
            from,
            value: -1,
            given_at: date,
        });
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
     * @param { string } collection - burrito
     * @param { string | null } match - matchObject to search for
     * @param { string } listType - defaults to 'to'
     * @return { Object } sum[] - data
     */
    async sum(collection: string, match: Object = null, listType: string): Promise<Sum[]> {
        await this.connect();
        const aggregations: Array<Object> = [{ $match: { to: { $exists: true } } }];
        if (match) {
            aggregations.push({ $match: match });
        }
        aggregations.push({ $group: { _id: listType, score: { $sum: '$value' } } });
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
    async getScore(user: string, listType: string, num = false) {
        const match = { [listType]: user };

        if (num) {
            const data = await this.sum('burritos', match, listType);
            return data.length ? data[0].score : 0;
        }
        return this.find('burritos', match);
    }

    /**
     * Returns scoreboard
     * Should be able to return burrito List ( scoreType inc ) and
     * listtype ( dec ) AKA rottenburritoList
     */
    async getScoreBoard({ user, listType, today }) {
        let match: any = {};

        if (user) {
            match = (listType === 'from') ? { to: user } : { from: user };
        }
        if (today) {
            match.given_at = { $gte: time().start, $lt: time().end };
        }
        return this.find('burritos', match);
    }
}

export default MongoDBDriver;
