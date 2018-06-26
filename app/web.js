const log = require('bog');
// Webserver
const http = require('http');
const express = require('express');

const app = express();

const BurritoStore = require('./store/Burrito');
const mergeData = require('./lib/mergeSlackRedis');

const server = http.createServer(app);
const io = require('socket.io').listen(server, {
    path: '/heyburrito/socket.io',
});

module.exports = ((
    publicPath,
    serverStoredSlackUsers,
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

    BurritoStore.on('GIVE', ({ user }) => {
        BurritoStore.getUserScore(user).then((result) => {
            const users = mergeData(serverStoredSlackUsers(), result);

            io.emit('GIVE', users);
        });
    });

    BurritoStore.on('TAKE_AWAY', ({ user }) => {
        BurritoStore.getUserScore(user).then((result) => {
            const users = mergeData(serverStoredSlackUsers(), result);

            io.emit('TAKE_AWAY', users);
        });
    });

    /*
        Socket.io
    */
    io.on('connection', (socket) => {
        socket.on('getReceivedList', () => {
            BurritoStore.getUserScore().then((users) => {
                const result = mergeData(serverStoredSlackUsers(), users);

                socket.emit('receivedList', result);
            });
        });

        socket.on('getGivenList', () => {
            BurritoStore.getUserScore().then((users) => {
                const result = mergeData(serverStoredSlackUsers(), users.map((user) => {
                    user._id = user.from;

                    return user;
                }));

                socket.emit('givenList', result);
            });
        });

        socket.on('getUserStats', (user) => {
            BurritoStore.getGivers(user)
                .then(users => mergeData(serverStoredSlackUsers(), users))
                .then((givers) => {
                    BurritoStore.getGiven(user).then((gived) => {
                        BurritoStore.getUserScore(user).then((userScoreData) => {
                            const result = mergeData(serverStoredSlackUsers(), userScoreData);
                            const obj = {
                                user: result[0],
                                gived,
                                givers,
                            };

                            socket.emit('userStats', obj);
                        });
                    });
                });
        });
    });

    const port = process.env.PORT || 3333;
    log.info(`Webserver listening to: ${port}`);
    server.listen(port);
});
