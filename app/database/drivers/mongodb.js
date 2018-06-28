const config = require('../../lib/config');

class MongoDBDriver {
    constructor(MongoClient) {
        this.MongoClient = MongoClient;
        this.url = config('MONGODB_URL');
        this.databaseName = config('MONGODB_DATABASE');
        this.db = null;
        this.client = null;
    }

    connect() {
        if (this.client && this.client.isConnected()) {
            return Promise.resolve(this.client);
        }

        return this.MongoClient.connect(this.url).then((client) => {
            this.client = client;
            this.db = client.db(this.databaseName);
        });
    }

    async store(collection, data) {
        await this.connect();

        if (Array.isArray(data)) {
            return this.db.collection(collection).insertMany(data);
        }

        return this.db.collection(collection).insertOne(data);
    }

    async find(collection, query) {
        await this.connect();

        return this.db.collection(collection).find(query).toArray();
    }

    async sum(collection, key = 'value', match = null, groupBy = 'to') {
        await this.connect();

        const aggregations = [{ $match: { to: { $exists: true } } }];

        if (match) {
            aggregations.push({ $match: match });
        }

        aggregations.push({ $group: { _id: `$${groupBy}`, score: { $sum: `$${key}` } } });
        aggregations.push({ $sort: { score: -1 } });

        return this.db.collection(collection).aggregate(aggregations).toArray();
    }
}

module.exports = MongoDBDriver;
