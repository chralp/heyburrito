import dotenv from 'dotenv';
dotenv.config();
import config from './lib/config'
import { default as log } from 'bog';
import { RTMClient, WebClient } from '@slack/client';
import Bot from './Bot';
import webserver from './web';
import database from './database';
import BurritoStore from './store/BurritoStore';
import slackUsers from './lib/getSlackUsers';
import getUserStats from './lib/handleStats';

//Interfaces
import SlackInterface from './types/Slack.interface'

log.info("Staring heyburrito")

// Configure BurritoStore
BurritoStore.setDatabase(database);

// Local store
const botName: string = config("BOT_NAME")
let botId: string;
let storedSlackBots: Array<SlackInterface.Stored>;
let storedSlackUsers: Array<SlackInterface.Stored>;

// Set and start RTM
const rtm = new RTMClient(config("SLACK_API_TOKEN"));
rtm.start();

// Set up webClient and fetch slackUsers
const wbc = new WebClient(config("SLACK_API_TOKEN"));

// Return localstore of slackusers
function serverStoredSlackUsers() {
    return storedSlackUsers;
}

getUserStats(serverStoredSlackUsers);

// Match heyburrito bot and assign username to botid
function getBotUsername() {

    storedSlackBots.forEach((x: any) => {
        if (x.name === botName) {
            botId = x.id;
        }
    });

    if (!botId) {
        log.warn(`Could not found bot ${config("BOT_NAME")} on slack account`);
    }
}

// Return heyburrito botid
function botUserID() {
    return botId;
}

// Returns all bots
function getAllBots() {
    return storedSlackBots;
}

// Start bot instance
const BotInstance = new Bot(rtm, botUserID, getUserStats, getAllBots);
BotInstance.listener();

// Update local stores
async function localStore() {
    const res = await slackUsers(wbc);
    storedSlackUsers = null;
    storedSlackBots = null;
    storedSlackUsers = res.users;
    storedSlackBots = res.bots;
    return getBotUsername();
}

// Run localstore
localStore();

// Run update of localstore every hour
setInterval(localStore, 60 * 60 * 1000);

// Start webserver
webserver(config("THEME"), serverStoredSlackUsers);
