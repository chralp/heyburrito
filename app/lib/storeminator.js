const config = require('./config');
const BurritoStore = require('../store/burrito');

module.exports = (() => {
    const dailyCap = config('SLACK_DAILY_CAP');

    function handleMsg(giver, updates) {
        BurritoStore.givenBurritosToday(giver).then((burritos) => {
            console.log('%s has given %d burritos today', giver, burritos.length);

            if (burritos.length >= dailyCap) {
                console.log('Daily cap of %d reached', dailyCap);
                return;
            }

            const a = updates.shift();

            if (a.type === 'inc') {
                BurritoStore.giveBurrito(a.username, giver);
            } else if (a.type === 'dec') {
                BurritoStore.takeAwayBurrito(a.username, giver);
            }
        });
    }

    function storeminator(msg) {
        const { giver, updates } = msg;

        if (updates.length) {
            handleMsg(giver, updates);
        }
    }

    return {
        storeminator,
    };
});
