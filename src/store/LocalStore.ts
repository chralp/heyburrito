import log from 'loglevel';
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
        this.storedUsers.push({
            id: 'BurritoFee',
            name: 'BurritoFee bank',
            avatar: 'https://secure.gravatar.com/avatar/c8facda114a361db902d0cbf6481e819.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0006-48.png',
            memberType: 'member',
        })
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
