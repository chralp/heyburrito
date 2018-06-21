const log = require('bog');
// Webserver
const http = require('http');
const express = require('express');

const app = express();

const Maestro = require('./maestro');

const server = http.createServer(app);
const io = require('socket.io').listen(server, {
    path: '/heyburrito/socket.io',
});

module.exports = ((
    publicPath,
    mergeData,
    mergeGiven,
    serverStoredSlackUsers,
    getGivers,
    getFullScore,
    getUserScore,
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
        getUserScore(user).then((res) => {
            const result = mergeData(serverStoredSlackUsers(), res);
            io.emit('GIVE', result);
        })

    });

    Maestro.on('TAKE_AWAY', ({ user }) => {
        io.emit('TAKE_AWAY', user);
    });

    /*
        Socket.io
    */
    io.on('connection', (socket) => {

        getFullScore().then((res) => {
            const result = mergeData(serverStoredSlackUsers(), res);
            socket.emit('getUsers', result);
        });

        socket.on('getRecivedLog', (data) => {
            getGivers(data.username).then((res) => {
                const result = mergeGiven(serverStoredSlackUsers(), res);
                socket.emit('given', result);
            });
        });
    });

    const port = process.env.PORT || 3333;
    log.info(`Webserver listening to: ${port}`);
    server.listen(port);
});
