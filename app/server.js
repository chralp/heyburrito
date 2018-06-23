const log = require('bog');
const path = require('path');
const redis = require('redis');
const webserver = require('./web');

const { RTMClient, WebClient } = require('@slack/client');

let confFile;

// Configuration file to use
const root = path.normalize(`${__dirname}/../`);
const conf = require(root + (confFile = process.env.CONF || 'conf-localhost.json'));
const theme = ('theme' in conf) ? conf.theme : 'default';
const publicPath = `${root}www/themes/${theme}`;


// Log level
const isLocal = confFile.indexOf('-localhost') > 0;

if (isLocal) log.level('debug');

// Redis config
const client = redis.createClient(conf.redis);


// Local UserStore
let storedSlackUsers;
let bot_id;

// Set and start RTM
const rtm = new RTMClient(conf.slack.apiToken);
rtm.start();


// Fun
const {
    storeminator, getGivers, getFullScore, getUserScore, getGiven,
} = require('./lib/storeminator')(redis, client, conf.slack.dailyCap);
// Fun
const { handleStats } = require('./lib/handleStats')(redis, client);

const wbc = new WebClient(conf.slack.apiToken);
const { slackUsers } = require('./lib/getSlackUsers')(wbc);

const mergeData = require('./lib/mergeSlackRedis');
const mergeGiven = require('./lib/mergeGiven');


function getBotUsername() {
    if (!conf.bot_name) {
        log.warn('No botname set in config, some features may not work');
        return;
    }

    storedSlackUsers.forEach((x) => {
        if (x.name === conf.bot_name) {
            bot_id = x.id;
        }
    });

    if (!bot_id) {
        log.warn('Botname set in config, but could not match user on slack');
    }
}


function botUserID() {
    return bot_id;
}

function localStore() {
    slackUsers().then((res) => {
        storedSlackUsers = null;
        storedSlackUsers = res;
        getBotUsername();
    });
}

// Run on boot
localStore();
const { listener } = require('./bot')(rtm, conf.slack.emojis, storeminator, botUserID,handleStats);

listener();
// Run every hour
setInterval(localStore, 60 * 60 * 1000);

function serverStoredSlackUsers() {
    return storedSlackUsers;
}

// Start webserver
webserver(
    publicPath,
    mergeData,
    mergeGiven,
    serverStoredSlackUsers,
    getGivers,
    getFullScore,
    getUserScore,
    getGiven,
);
