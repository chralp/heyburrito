require('coffee-script/register');
const log = require('bog');
const path = require('path');
const redis = require('redis');

const { RTMClient, WebClient } = require('@slack/client');

let confFile;
// Configuration file to use
const root = path.normalize(`${__dirname}/../`);
const conf = require(root + (confFile = process.env.CONF || 'conf-localhost.json'));
const theme = ('theme' in conf) ? conf.theme : 'default';

// Log level
const isLocal = confFile.indexOf('-localhost') > 0;

if (isLocal) log.level('debug');

// Redis config
const client = redis.createClient(conf.redis);

// Webserver
const http = require('http');
const express = require('express');

const app = module.exports.app = express();

const server = http.createServer(app);
const io = require('socket.io').listen(server, {
    path: '/heyburrito/socket.io',
});

const publicPath = `${root}www/themes/${theme}`;

// Local UserStore
let storedSlackUsers;


// Set and start RTM
const rtm = new RTMClient(conf.slack.apiToken);
rtm.start();


// Fun
const { storeminator, getUserScores, getGivers } = require('./storeminator')(redis, client);
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


/*
    Express settings
*/

app.enable('strict routing');
app.use((request, response, next) => {
    response.header('Cache-Control', 'no-cache');
    response.header('Access-Control-Allow-Origin', '*');
    return next();
});
app.use('/heyburrito/', express.static(publicPath));
app.get('/', (req, res) => res.redirect('/heyburrito/'));
app.get(/^\/heyburrito$/, (req, res) => res.redirect('/heyburrito/'));
app.get('/heyburrito/', (req, res) => res.sendfile(`${publicPath}/index.html`));

/*
    Socket.io
*/
io.on('connection', (socket) => {
    getUserScores().then((res) => {
        const result = mergeData(storedSlackUsers, res);
        socket.emit('getUsers', result);
    });

    socket.on('getRecivedLog', (data) => {
        getGivers(data.username).then((res) => {
            const result = mergeGiven(storedSlackUsers, res);
            socket.emit('given', result);
        });
    });
});

const port = process.env.PORT || 3333;
log.info(`Webserver listening to: ${port}`);
server.listen(port);
