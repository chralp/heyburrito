import BurritoStore from '../store/burrito'
import mergeData from './mergeUserData'

// Interfaces
import UserScoreInterface from '../types/UserScore.interface';
import UserInterface from '../types/User.interface';


export default ((serverStoredSlackUsers:Function) => {

    async function getUserStats(username:string) {
        const users:Array<UserInterface> = mergeData(serverStoredSlackUsers(), [{ _id: username }]);
        let returnUser = null;

        if (users.length) {
            returnUser = users[0];
        }

        if (!returnUser) {
            return(null);
        }

        const userScoreData:Array<UserScoreInterface> = await BurritoStore.getUserScore(username);
        const givers:Array<UserScoreInterface> = await BurritoStore.getGivers(username);
        const given:Array<UserScoreInterface> = await BurritoStore.getGiven(username);

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
