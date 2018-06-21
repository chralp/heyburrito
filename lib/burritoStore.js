const moment = require('moment');
const Maestro = require('./maestro');

function makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = ((redis, client) => {
    // Username prefix-fix
    const receivedKey = username => `${username}:received`;
    const receivedLogKey = username => `${username}:receivedLog`;
    const givenKey = username => `${username}:given`;
    const givenCapKey = username => `${username}:dailyCap`;

    function getter(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (error, value) => {
                if (error) {
                    reject();
                }

                resolve(value);
            });
        });
    }

    const setKeyToExpire = key => new Promise((rs) => {
        client.set(`${key}:${makeid()}`, 'DummyValue', 'ex', moment().endOf('day').diff(moment(), 'seconds'), (error, value) => {
            rs(value);
        });
    });

    const getUserCap = user => new Promise((rs) => {
        client.keys(`${user}:*`, (err, keys) => {
            if (err) {
                console.log(err);
                return;
            }
            rs(keys);
        });
    });

    const getUserScores = (user) => new Promise((rs) => {
        client.keys(user, (err, keys) => {
            if (err) {
                console.log(err);
                return;
            }

            if (keys) {
                const waitFor = keys.map(key => getter(key).then(score => ({
                    user: key.split(':')[0],
                    score,
                })));

                Promise.all(waitFor).then((res) => {
                    rs(res);
                });
            }
        });
    });

    // Push givers to user
    function addGiver(user, giver) {
        client.lpush(receivedLogKey(user), giver);
    }
    // Get list of givers for user
    function getGivers(user) {
        return new Promise((rs) => {
            client.lrange(receivedLogKey(user), 0, -1, (err, keys) => {
                rs(keys);
            });
        });
    }

    const increaser = (username) => {
        client.incr(username, redis.print);
    };

    const decreaser = (username) => {
        client.decr(username, redis.print);
    };

    const getGiven = user => getter(givenKey(user));
    const incrGiven = user => increaser(givenKey(user));

    // Daily cap
    const incrGivenCap = user => setKeyToExpire(givenCapKey(user));
    const getGivenCap = user => getUserCap(givenCapKey(user));

    // Daily cap
    const getFullScore = (user = "*") => getUserScores(receivedKey(user));
    const getUserScore = user => getUserScores(receivedKey(user));



    const giveBurrito = (user) => {
        Maestro.emit('GIVE', { user });

        return increaser(receivedKey(user));
    };

    const takeAwayBurrito = (user) => {
        Maestro.emit('TAKE_AWAY', { user });

        return decreaser(receivedKey(user));
    };

    return {
        getGiven,
        giveBurrito,
        takeAwayBurrito,
        incrGiven,
        getUserScores,
        addGiver,
        getGivers,
        incrGivenCap,
        getGivenCap,
        setKeyToExpire,
        getFullScore,
        getUserScore
    };
});
