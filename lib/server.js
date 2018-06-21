require('coffee-script/register');
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


// Set and start RTM
const rtm = new RTMClient(conf.slack.apiToken);
rtm.start();


// Fun
const { storeminator, getUserScores, getGivers } = require('./storeminator')(redis, client, conf.slack.dailyCap);
const { listener } = require('./listener')(rtm, conf.slack.emojis, storeminator);

listener();

const wbc = new WebClient(conf.slack.apiToken);
const { slackUsers } = require('../fun/getSlackUsers')(wbc);

const mergeData = require('../fun/mergeSlackRedis');
const mergeGiven = require('../fun/mergeGiven');

function localStore() {
    slackUsers().then((res) => {
        storedSlackUsers = null;
        storedSlackUsers = res;
    });
}

// Run on boot
localStore();

// Run every hour
setInterval(localStore, 60 * 60 * 1000);

function serverStoredSlackUsers() {
    return storedSlackUsers;
}

// Start webserver
webserver(
    publicPath,
    getUserScores,
    mergeData,
    mergeGiven,
    serverStoredSlackUsers,
    getGivers,
);
