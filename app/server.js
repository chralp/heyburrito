require('dotenv').config();

const log = require('bog');
const path = require('path');
const redis = require('redis');
const webserver = require('./web');

const { RTMClient, WebClient } = require('@slack/client');

// Configuration file to use
const root = path.normalize(`${__dirname}/../`);
const theme = ('THEME' in process.env) ? process.env.THEME : 'default';
const publicPath = `${root}www/themes/${theme}`;


// Log level
const isLocal = !process.env.ENV || process.env.ENV === 'development';

if (isLocal) log.level('debug');

// Redis config
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});


// Local UserStore
let storedSlackBots;
let storedSlackUsers;
let botId;

// Set and start RTM
const rtm = new RTMClient(process.env.SLACK_API_TOKEN);
rtm.start();


// Fun

function serverStoredSlackUsers() {
    return storedSlackUsers;
}

const { storeminator } = require('./lib/storeminator')(redis, client, process.env.SLACK_DAILY_CAP);

const {
    getUserStats,
    getRecivedList,
    getGivenList,
} = require('./lib/handleStats')(redis, client, serverStoredSlackUsers);

const wbc = new WebClient(process.env.SLACK_API_TOKEN);
const { slackUsers } = require('./lib/getSlackUsers')(wbc);

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

function localStore() {
    slackUsers().then((res) => {
        storedSlackUsers = null;
        storedSlackBots = null;
        storedSlackUsers = res.users;
        storedSlackBots = res.bots;
        getBotUsername();
    });
}

// Run on boot
localStore();
const { listener } = require('./bot')(rtm, storeminator, botUserID, getUserStats, getAllBots);

listener();
// Run every hour
setInterval(localStore, 60 * 60 * 1000);


// Start webserver
webserver(
    publicPath,
    serverStoredSlackUsers,
    getUserStats,
    getRecivedList,
    getGivenList,
);
