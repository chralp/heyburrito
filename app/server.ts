import dotenv from 'dotenv'
import log from 'bog'
import path from 'path'
import webserver from './web'
import database from './database'
import BurritoStore from './store/burrito'
import { RTMClient, WebClient } from '@slack/client'
dotenv.config()

// Configure BurritoStore
BurritoStore.setDatabase(database);

// Configuration file to use
const root:string = path.normalize(`${__dirname}/../`);
const theme:string = ('THEME' in process.env) ? process.env.THEME : 'default';
const publicPath:string = `${root}www/themes/${theme}`;


// Log level
const isLocal:boolean = !process.env.ENV || process.env.ENV === 'development';

if (isLocal) log.level('debug');


// Local UserStore
let storedSlackBots:Array<object>;
let storedSlackUsers:Array<object>;
let botId:string;

// Set and start RTM
const rtm = new RTMClient(process.env.SLACK_API_TOKEN);
rtm.start();

function serverStoredSlackUsers() {
    return storedSlackUsers;
}
// Fun
import getUserStats from './lib/handleStats'
getUserStats(serverStoredSlackUsers)

const wbc = new WebClient(process.env.SLACK_API_TOKEN);
import slackUsers from './lib/getSlackUsers'
slackUsers(wbc)

function getBotUsername() {
    if (!process.env.BOT_NAME) {
        log.warn('No botname set in config, some features may not work');
        return;
    }

    storedSlackBots.forEach((x) => {
        if (x.name === process.env.BOT_NAME) {
            botId = x.id;
        }
    });

    if (!botId) {
        log.warn('Botname set in config, but could not match user on slack');
    }
}


function botUserID() {
    return botId;
}

function getAllBots() {
    return storedSlackBots;
}

async function localStore() {
    const res = await slackUsers(wbc)
    console.log("res", res)
    storedSlackUsers = null;
    storedSlackBots = null;
    storedSlackUsers = res.users;
    storedSlackBots = res.bots;
    return getBotUsername();
}

// Run on boot
localStore();
const { listener } = require('./bot')(rtm, botUserID, getUserStats, getAllBots);

listener();
// Run every hour
setInterval(localStore, 60 * 60 * 1000);

// Start webserver
webserver(
    publicPath,
    serverStoredSlackUsers,
);
