const log = require('bog');

module.exports = ((redis, client) => {
    const {
        getGiven,
        giveBurrito,
        incrGiven,
        addGiver,
        getUserScores,
        getGivers,
        incrGivenCap,
        getGivenCap,
    } = require('./burritoStore')(redis, client);

    function storeminator(msg) {
        const dailyCap = 5;
        const { giver, updates } = msg;

        getGivenCap(giver).then((res) => {
            for (const a of updates) {
                giveBurrito(a.username);
                incrGiven(giver);
                addGiver(a.username, giver);
                incrGivenCap(giver);
            }
        }).then(() => {
            getGivenCap(giver).then((res) => {
                incrGivenCap(giver);
            }).then(() => {
                getGivenCap(giver).then((res) => {
                    console.log('res', res);
                });
            });
        });
    }
    return { storeminator, getUserScores, getGivers };
});
