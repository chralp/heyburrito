import BurritoStore from '../store/burrito'
import UserScore from '../types/UserScore.interface';
const mergeData = require('./mergeSlackRedis');

export default ((serverStoredSlackUsers:Function) => {
    async function getUserStats(username:string) {
            const users:Array<object> = mergeData(serverStoredSlackUsers(), [{ _id: username }]);
            let returnUser = null;

            if (users.length) {
                returnUser = users[0];
            }

            if (!returnUser) {
                return(null);
            }

            const userScoreData:Array<UserScore> = await BurritoStore.getUserScore(username);
            const givers:Array<UserScore> = await BurritoStore.getGivers(username);
            const given:Array<UserScore> = await BurritoStore.getGiven(username);

            if (userScoreData.length) {
                returnUser.score = userScoreData[0].score;
            } else {
                returnUser.score = 0;
            }

            returnUser.givers = mergeData(serverStoredSlackUsers(), givers);
            returnUser.given = mergeData(serverStoredSlackUsers(), given);

            await(returnUser);
    }

    return { getUserStats };
});
