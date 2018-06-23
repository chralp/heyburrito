
const store = require('../store/burrito');

module.exports = ((redis, client, dailyCap) => {
    const {
        giveBurrito,
        takeAwayBurrito,
        incrGiven,
        addGiver,
        getGivers,
        incrGivenCap,
        getGivenCap,
        getFullScore,
        getUserScore,
        getGiven,
    } = store(redis, client);

    function handleMsg(giver, updates) {
        getGivenCap(giver).then((res) => {
            if (res.length >= dailyCap) {
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
        if (updates.length) {
            handleMsg(giver, updates);
        }else{
            return false
        }
    }
    return {
        storeminator, getGivers, getFullScore, getUserScore, getGiven,
    };
});
