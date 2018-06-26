const log = require('bog');
const http = require('http');
const express = require('express');

const app = express();
const Maestro = require('./lib/maestro');

const server = http.createServer(app);
const io = require('socket.io').listen(server, {
    path: '/heyburrito/socket.io',
});

module.exports = ((

    publicPath,
    serverStoredSlackUsers,
    getUserStats,
    getRecivedList,
    getGivenList,

) => {
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

    Maestro.on('GIVE', ({ user }) => {
        log.info('GIVE', user);
        /*
        getUserScore(user).then((res) => {
            const result = mergeData(serverStoredSlackUsers(), res);
            io.emit('GIVE', result);
        });
        */
    });

    Maestro.on('TAKE_AWAY', ({ user }) => {
        log.info('TAKE_AWAY', user);
        /*
        getUserScore(user).then((res) => {
            const result = mergeData(serverStoredSlackUsers(), res);
            io.emit('TAKE_AWAY', result);
        });
        */
    });

    /*
        Socket.io
    */
    io.on('connection', (socket) => {
        socket.on('getRecivedList', () => {
            getRecivedList().then((res) => {
                socket.emit('recivedList', res);
            });
        });

        socket.on('getUserStats', (user) => {
            getUserStats(user).then((res) => {
                socket.emit('userStats', res);
            });
        });

        socket.on('getGivenList', () => {
            getGivenList().then((res) => {
                socket.emit('givenList', res);
            });
        });
    });

    const port = process.env.PORT || 3333;
    log.info(`Webserver listening to: ${port}`);
    server.listen(port);
});
