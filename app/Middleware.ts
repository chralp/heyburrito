import log from 'bog';

import BurritoStore from './store/BurritoStore';
import mergeUserData from './lib/mergeUserData';

/**
 * Middleware for API and Websocket
 */
class Middleware {

    async getUserScore({ user = null, scoreType = null }) {
        const score = await BurritoStore.getUserScore({ user, scoreType });
        const data = mergeUserData(score);
        return data;
    };

    async getUserStats(user: string) {
        const [givers, given, userScore] = await Promise.all([
            BurritoStore.getUserScoreList({ user, scoreType: 'from' }),
            BurritoStore.getUserScoreList({ user, scoreType: 'to' }),
            BurritoStore.getUserScore({ user }),
        ]);

        const data = {
            user: mergeUserData(userScore)[0],
            gived: mergeUserData(given),
            givers: mergeUserData(givers),
        }
        return data;
    }
}

export default new Middleware();
