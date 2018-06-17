const store = require('./burritoStore');

module.exports = ((redis, client) => {
    const {
        giveBurrito,
        incrGiven,
        addGiver,
        getUserScores,
        getGivers,
        incrGivenCap,
        getGivenCap,
    } = store(redis, client);

    function storeminator(msg) {
        const { giver, updates } = msg;

        getGivenCap(giver).then(() => {
            updates.forEach((a) => {
                giveBurrito(a.username);
                incrGiven(giver);
                addGiver(a.username, giver);
                incrGivenCap(giver);
            });
        }).then(() => {
            getGivenCap(giver).then(() => {
                incrGivenCap(giver);
            });
        });
    }
    return { storeminator, getUserScores, getGivers };
});
