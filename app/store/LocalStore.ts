import { default as log } from 'bog';
import config from '../lib/config'
import slackUsers from '../lib/getSlackUsers';

//Interfaces
import SlackInterface from '../types/Slack.interface'

/*
* class Handles localstore of slackusers and bots
* and provides functions to get stored users and bots
*/
class LocalStore {

    wbc = null;
    botId: string = null
    storedBots: Array<SlackInterface.Stored>;
    storedUsers: Array<SlackInterface.Stored>;
    botName: string = config("BOT_NAME");

    start(wbc: any) {
        this.wbc = wbc
        this.fetchSlackUsers()
    }

    // Fetch / get all slackUsers from API
    async fetchSlackUsers() {
        const res = await slackUsers(this.wbc);
        this.storedUsers = [];
        this.storedBots = [];
        this.storedUsers = res.users;
        this.storedBots = res.bots;
        this.getBotUsername()

        // Run update of localstore every hour
        setInterval(this.fetchSlackUsers, 60 * 60 * 1000);

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
            log.warn(`Could not found bot ${config("BOT_NAME")} on slack account`);
        }
    }

}

export default new LocalStore();
