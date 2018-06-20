
const store = require('./burritoStore');

module.exports = ((redis, client) => {
    const {
        giveBurrito,
        takeAwayBurrito,
        incrGiven,
        addGiver,
        getUserScores,
        getGivers,
        incrGivenCap,
        getGivenCap,
    } = store(redis, client);

    function handleMsg(giver, updates) {
        getGivenCap(giver).then((res) => {
            if (res.length >= 5) {
                return false;
            }
            const a = updates.shift();
            if (a.type === 'inc') {
                giveBurrito(a.username);
            } else if (a.type === 'dec') {
                takeAwayBurrito(a.username);
            }

            incrGiven(giver);
            addGiver(a.username, giver);

            incrGivenCap(giver).then(() => {
                if (updates.length) {
                    handleMsg(giver, updates);
                }
            });
        }).catch(() => {
            console.log('Daily cap for %s', giver);
        });
    }

    function storeminator(msg) {
        const { giver, updates } = msg;
        if (updates.length <= 5) {
            handleMsg(giver, updates);
        }
    }
    return { storeminator, getUserScores, getGivers };
});
