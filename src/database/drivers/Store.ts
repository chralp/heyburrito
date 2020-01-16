import fs from 'fs';
import path from 'path';
import config from '../../config';

export default class Store {
    dbPath: string;

    connected: boolean;

    dataSynced: boolean;

    data: any;

    constructor(public driver: string) {
        this.connected = false;
        this.dbPath = path.resolve(`${config.db.db_path}${config.db.db_fileName}`);
        this.dataSynced = false;
        this.data = [];
    }

    connect(): boolean {
        if (this.driver === 'array') {
            this.connected = true;
            return true;
        }

        if (this.driver === 'file') {
            if (!this.connected && !fs.existsSync(this.dbPath)) {
                fs.writeFileSync(this.dbPath, '', 'utf8');
                this.connected = true;
                return true;
            }
        }
        return false;
    }

    syncData() {
        this.connect();
        if (this.driver === 'array') return true;

        this.data = [];

        const fd = fs.readFileSync(this.dbPath, 'utf8');
        if (!fd.length) return false;

        const items = fd.split('\n');
        if (!items.length) return false;

        const mappedItems = items.map((item: any) => {
            let parsedData: any;
            try {
                parsedData = JSON.parse(item);
            } catch (ex) {
                return null;
            }

            parsedData.given_at = new Date(parsedData.given_at);
            return parsedData;
        });
        this.data = mappedItems.filter((item: any) => item);
        return true;
    }

    async storeData(score) {
        if (this.driver === 'array') {
            this.data.push(score);
            return true;
        }

        if (this.driver === 'file') {
            fs.appendFileSync(this.dbPath, `\n${JSON.stringify(score)}`);
            return true;
        }
        return false;
    }

    async getData() {
        return this.data;
    }
}
