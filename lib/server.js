require('coffee-script/register')
const log   =   require('bog')
const path  =   require('path')
const redis =   require("redis")
const fs    = require('fs')

const { RTMClient, WebClient } = require('@slack/client');

// Configuration file to use
const root = path.normalize(__dirname + '/../')
const conf = require(root + (confFile = process.env.CONF || 'conf-localhost.json'))

// Log level
const isLocal = confFile.indexOf('-localhost') > 0

if (!!isLocal) log.level('debug')

// Redis config
const client = redis.createClient(conf.redis);

// Webserver
const http = require('http');
const express = require('express'),
    app = module.exports.app = express();

const server = http.createServer(app);
const io = require('socket.io').listen(server,{
    path: '/heyburrito/socket.io'
})
const publicPath = root + 'www';

// Local UserStore
let storedSlackUsers = []


// Set and start RTM
const rtm = new RTMClient(conf.slack.apiToken)
rtm.start();


// Fun
const {getRedisUser} = require('../fun/getRedisUser')(redis,client)
const { storeminator } = require('./storeminator')(redis,client)
const {listener} = require('./listener')(rtm,conf.slack.emojis,storeminator)
listener()

const wbc = new WebClient(conf.slack.apiToken)
const { slackUsers } = require('../fun/getSlackUsers')(wbc)


function localStore(){
   slackUsers().then((res) => {
        storedSlackUsers = []
        storedSlackUsers = res
    })
}
// Run on boot
localStore()

// Run every hour
setInterval(localStore, 60*60*1000)


/*
    Express settings
*/

app.enable('strict routing');
app.use(function(request, response, next) {
  response.header('Cache-Control', 'no-cache');
  response.header('Access-Control-Allow-Origin', '*');
  return next();
});
app.use('/heyburrito/', express["static"](publicPath));
app.get('/', function(req, res) {
  return res.redirect('/heyburrito/');
});
app.get(/^\/heyburrito$/, function(req, res) {
  return res.redirect('/heyburrito/');
});
app.get('/heyburrito/', function(req, res) {
  return res.sendfile(publicPath + '/index.html');
});

/*
    Socket.io
*/
io.on('connection', function (socket) {
    socket.emit('getUsers', storedSlackUsers);
});

port = process.env.PORT || 3333;
log.info('Webserver listening to: ' + port)
server.listen(port)
