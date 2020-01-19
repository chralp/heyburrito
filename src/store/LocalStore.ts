import * as log from 'bog';
import config from '../config';
import WBCHandler from '../slack/Wbc';

class LocalStore {
    botId: string = null;

    storedBots: any;

    storedUsers: any;

    botName: string = config.slack.bot_name;

    async start() {
        await this.fetch();

        // Run update of localstore every hour
        setTimeout(() => this.start(), 60 * 60 * 1000);
    }

    async fetch() {
        log.info('Fetching slackUsers');
        const { users, bots } = await WBCHandler.fetchSlackUsers();
        this.storedUsers = [];
        this.storedBots = [];
        this.storedUsers = users;
        this.storedBots = bots;

        this.getBotUsername();
        return true;
    }

    getSlackUsers() {
        return this.storedUsers;
    }

    botUserID() {
        return this.botId;
    }

    getAllBots() {
        return this.storedBots;
    }

    getBotUsername(): void {
        this.storedBots.forEach((x: any) => {
            if (x.name === this.botName) {
                this.botId = x.id;
            }
        });

        if (!this.botId) {
            log.warn(`Could not found bot ${config.slack.bot_name} on slack account`);
        }
    }
}

export default new LocalStore();
