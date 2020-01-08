import Driver from './Driver';
import { time } from '../../lib/utils';
import ScoreInterface from '../../types/Score.interface';
import fs from 'fs';
import path from 'path';

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
    scoreinc?: number;
    scoredec?: number;
}

function id() {
    // Cred => https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
};

class FileDriver extends Driver {
    dbPath: string;
    connected: boolean;
    data: Array<ScoreInterface>;
    dataSynced: boolean;

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
        if (!fd.length) return;

        const items = fd.split('\n');
        if (!items.length) return;

        const mappedItems: Array<ScoreInterface> = items.map((item) => {
            let parsedData: ScoreInterface;
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

    async give(to: string, from: string) {
        await this.connect();

        this.dataSynced = false;

        const score: ScoreInterface = {
            to,
            from,
            _id: id(),
            value: 1,
            given_at: new Date(),
        };

        return fs.appendFileSync(this.dbPath, `\n${JSON.stringify(score)}`);
    }

    async takeAway(to: string, from: string) {
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
        return true;
    }


    async getScore(user: string, listType: string): Promise<Find[]> {
        await this.syncData();
        let { data } = this;
        const filteredData = this.data.filter(item => item[listType] == user);
        return Promise.resolve(filteredData);
    }




    async findFromToday(user: string, listType: string): Promise<Find[]> {
        await this.syncData();

        const filteredData = this.data.filter(item => {
            if (item[listType] == user &&
                item.given_at.getTime() < time().end.getTime() &&
                item.given_at.getTime() > time().start.getTime()) {
                return item;
            };
        })
        return filteredData;
    }

    async getScoreBoard({ user, listType, today }): Promise<Sum[]> {
        await this.syncData();
        let { data } = this;


        let listTypeSwitch: string;
        if (user) {
            listTypeSwitch = (listType === 'from') ? 'to' : 'from';
        } else {
            listTypeSwitch = listType;
        }

        let selected = data.filter((item) => {

            if (today) {
                if (item.given_at.getTime() < time().end.getTime() &&
                    item.given_at.getTime() > time().start.getTime()) {
                    if (user) {

                        if (item[listTypeSwitch] == user) return item
                    } else {
                        return item;
                    }
                }
            } else {
                if (user) {

                    if (item[listTypeSwitch] === user) return item
                } else {
                    return item;
                }
            }

        });


        const uniqueUsername = [...new Set(selected.map((x) => x[listType]))];

        const score = [];
        uniqueUsername.forEach((u) => {
            const hej = selected.filter(e => e[listType] === u)

            if (user) {

                const scoreinc = hej.filter((x) => x.value === 1);
                const scoredec = hej.filter((x) => x.value === -1);

                score.push({
                    _id: u,
                    scoreinc: scoreinc.length,
                    scoredec: scoredec.length
                })

            } else {

                const red = hej.reduce((a: number, item) => {
                    return a + item.value
                }, 0);
                score.push({ _id: u, score: red })
            }

        });
        return score;
    }
};

export default FileDriver;
