require('dotenv').config();

const log = require('bog');
const path = require('path');
const webserver = require('./web');
const database = require('./database');
const BurritoStore = require('./store/burrito');

// Configure BurritoStore
BurritoStore.setDatabase(database);

const { RTMClient, WebClient } = require('@slack/client');

// Configuration file to use
const root = path.normalize(`${__dirname}/../`);
const theme = ('THEME' in process.env) ? process.env.THEME : 'default';
const publicPath = `${root}www/themes/${theme}`;


// Log level
const isLocal = !process.env.ENV || process.env.ENV === 'development';

if (isLocal) log.level('debug');


// Local UserStore
let storedSlackBots;
let storedSlackUsers;
let botId;

// Set and start RTM
const rtm = new RTMClient(process.env.SLACK_API_TOKEN);
rtm.start();

function serverStoredSlackUsers() {
    return storedSlackUsers;
}
// Fun
const { getUserStats } = require('./lib/handleStats')(serverStoredSlackUsers);

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
const { listener } = require('./bot')(rtm, botUserID, getUserStats, getAllBots);

listener();
// Run every hour
setInterval(localStore, 60 * 60 * 1000);

// Start webserver
webserver(
    publicPath,
    serverStoredSlackUsers,
);
