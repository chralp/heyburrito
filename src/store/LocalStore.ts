import { default as log } from 'bog';
import config from '../config'
import slackUsers from '../lib/getSlackUsers';

//Interfaces
import SlackInterface from '../types/Slack.interface'

/*
* class Handles localstore of slackusers and bots
* and provides functions to get stored users and bots
*/

class LocalStore {

    wbc: any;
    botId: string = null
    storedBots: Array<SlackInterface.Stored>;
    storedUsers: Array<SlackInterface.Stored>;
    botName: string = config.slack.bot_name;

    async start(wbc: any) {
        this.wbc = wbc;
        this.fetch();
    }

    async fetch() {
        this.fetchSlackUsers();
    }

    // Fetch / get all slackUsers from API
    async fetchSlackUsers() {
        try {
            const res = await slackUsers(this.wbc);
            this.storedUsers = [];
            this.storedBots = [];
            this.storedUsers = res.users;
            this.storedBots = res.bots;
            this.getBotUsername();
        }

        catch (e) {
            log.warn(e);
        }

        // Run update of localstore every hour
        setTimeout(() => this.fetch(), 60 * 60 * 1000);

    }

    // Return stored users
    getSlackUsers() {
        return this.storedUsers
    }

    // Return heyburrito botid
    botUserID() {
        return this.botId;
    }

    // Returns all bots
    getAllBots() {
        return this.storedBots;
    }

    // Match heyburrito bot and assign username to botid
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