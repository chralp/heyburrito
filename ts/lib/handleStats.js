const BurritoStore = require('../store/burrito');
const mergeData = require('./mergeSlackRedis');

module.exports = ((serverStoredSlackUsers) => {
    function getUserStats(username) {
        return new Promise(async (resolve) => {
            const users = mergeData(serverStoredSlackUsers(), [{ _id: username }]);
            let returnUser = null;

            if (users.length) {
                returnUser = users[0];
            }

            if (!returnUser) {
                resolve(null);

                return;
            }

            const userScoreData = await BurritoStore.getUserScore(username);
            const givers = await BurritoStore.getGivers(username);
            const given = await BurritoStore.getGiven(username);

            if (userScoreData.length) {
                returnUser.score = userScoreData[0].score;
            } else {
                returnUser.score = 0;
            }

            returnUser.givers = mergeData(serverStoredSlackUsers(), givers);
            returnUser.given = mergeData(serverStoredSlackUsers(), given);

            resolve(returnUser);
        });
    }

    return { getUserStats };
});
