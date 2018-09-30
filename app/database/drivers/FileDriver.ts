import Driver from './Driver';
import ScoreInterface from '../../types/Score.interface';
import fs from 'fs';
import path from 'path';

function id() {
    // Cred => https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
}

class FileDriver extends Driver {
    dbPath:string;
    connected:boolean;
    data:Array<ScoreInterface>;
    dataSynced:boolean;

    constructor() {
        super();

        this.connected = false;
        this.dbPath = path.resolve(__dirname, '../../../.filedb');
        this.dataSynced = false;
        this.data = [];
    }

    async connect() {
        if (!this.connected && !fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, '', 'utf8');
            this.connected = true;
        }
    }

    async syncData() {
        await this.connect();

        this.data = [];

        const fd = fs.readFileSync(this.dbPath, 'utf8');

        if (!fd.length) {
            return;
        }

        const items = fd.split('\n');

        if (!items.length) {
            return;
        }

        const mappedItems:Array<ScoreInterface> = items.map((item) => {
            let parsedData:ScoreInterface;

            try {
                parsedData = JSON.parse(item);
            } catch (ex) {
                return null;
            }

            parsedData.given_at = new Date(parsedData.given_at);

            return parsedData;
        });

        this.data = mappedItems.filter(item => item);
    }

    async findFrom(user) {
        await this.syncData();

        const filteredData = this.data.filter(item => item.from == user);
        return await(filteredData);
    }

    async findFromToday(user) {
        await this.syncData();

        const start = new Date();
        const end = new Date();

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const filteredData = this.data.filter(item => item.from == user && item.given_at.getTime() < end.getTime() && item.given_at.getTime() > start.getTime());

        return await(filteredData);
    }

    async give(to:string, from:string) {
        await this.connect();

        this.dataSynced = false;

        const score:ScoreInterface = {
            to,
            from,
            _id: id(),
            value: 1,
            given_at: new Date(),
        };

        return fs.appendFileSync(this.dbPath, `\n${JSON.stringify(score)}`);
    }

    async takeAway(to:string, from:string) {
        await this.connect();

        this.dataSynced = false;

        this.data.push({
            _id: id(),
            to,
            from,
            value: -1,
            given_at:
            new Date(),
        });

        return await(true);
    }

    async getScore(user = null) {
        await this.syncData();

        let { data } = this;

        if (user) {
            data = this.data.filter(item => item.to === user);
        }

        const userScores = {};

        data.forEach((item) => {
            if (!(item.to in userScores)) {
                userScores[item.to] = { _id: item.to, score: 0 };
            }

            userScores[item.to].score += item.value;
        });

        return await((<any>Object).values(userScores));
    }

    async getGiven(user = null) {
        await this.syncData();

        let { data } = this;

        if (user) {
            data = this.data.filter(item => item.from === user);
        }

        const userScores = {};

        data.forEach((item) => {
            if (!(item.from in userScores)) {
                userScores[item.from] = { _id: item.from, score: 0 };
            }

            userScores[item.from].score += item.value;
        });

        return await((<any>Object).values(userScores));
    }

    async getGivers(user) {
        await this.syncData();

        let { data } = this;

        if (user) {
            data = this.data.filter(item => item.to === user);
        }

        const userScores = {};

        data.forEach((item) => {
            if (!(item.from in userScores)) {
                userScores[item.from] = { _id: item.from, score: 0 };
            }

            userScores[item.from].score += item.value;
        });

        return await((<any>Object).values(userScores));
    }
}

export default FileDriver;
