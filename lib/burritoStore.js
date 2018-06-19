module.exports = ((redis, client) => {
    // Username prefix-fix
    const receivedKey = username => `${username}:received`;
    const receivedLogKey = username => `${username}:receivedLog`;
    const givenKey = username => `${username}:given`;
    const givenCapKey = username => `${username}:givenCap`;

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

    function setter(key, value) {
        return new Promise((resolve, reject) => {
            client.set(key, value, (error, value) => {
                if (error || !value) {
                    reject();
                }
                resolve(value);
            });
        });
    }

    const getUserScores = () => new Promise((rs) => {
        client.keys('*:received', (err, keys) => {
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
    const incrGivenCap = user => increaser(givenCapKey(user));
    const getGivenCap = user => getter(givenCapKey(user));

    const giveBurrito = user => increaser(receivedKey(user));
    const takeAwayBurrito = user => decreaser(receivedKey(user));

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
    };
});
