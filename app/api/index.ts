import hapi from 'hapi';
import log from 'bog';
import BurritoStore from '../store/BurritoStore'
import mergeUserData from '../lib/mergeUserData';


export default () => {

    const server = new hapi.Server({
        host: 'localhost',
        port: 1337
    });

    server.route({
        method: 'GET',
        path: '/heyburrito/scoreboard/{listType}',
        handler: async (request: any, h: any) => {

            const ALLOWED_LISTTYPES: string[] = [
                'given',
                'givers'
            ];

            try {

                const { listType } = request.params;

                if (!ALLOWED_LISTTYPES.includes(listType)) throw ({
                    message: 'Allowed listType is given or received',
                    code: 400,
                });

                const scoreType: string = listType === 'given' ? 'to' : 'from';
                const score = await BurritoStore.getUserScore({ scoreType });

                const data = {
                    error: false,
                    code: 200,
                    message: null,
                    data: mergeUserData(score),
                };

                return h.response(data).code(200);

            } catch (err) {

                log.warn(err);

                return h.response({
                    error: true,
                    code: err.code || 500,
                    message: err.message,
                    data: null
                }).code(err.code || 500);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/heyburrito/userstats/{user}',
        handler: async (request: any, h: any) => {

            try {

                const { user } = request.params;

                if (!user.length) throw ({
                    message: 'You must provide slack userid',
                    code: 500
                });

                const [givers, given, userScore] = await Promise.all([
                    BurritoStore.getUserScoreList({ user, scoreType: 'from' }),
                    BurritoStore.getUserScoreList({ user, scoreType: 'to' }),
                    BurritoStore.getUserScore({ user }),
                ]);

                const [userStats] = mergeUserData(userScore);

                const data = {
                    error: false,
                    code: 200,
                    message: null,
                    data: {
                        user: userStats,
                        gived: mergeUserData(given),
                        givers: mergeUserData(givers),
                    }
                };

                return h.response(data).code(200);

            } catch (err) {

                log.warn(err);

                return h.response({
                    error: true,
                    code: err.code || 500,
                    message: err.message,
                    data: null
                }).code(err.code || 500);
            }
        }
    });



    server.route({
        method: 'POST',
        path: '/heyburrito/histogram',
        handler: async (request: any, h: any) => {
            console.log(request.payload)
            try {

                /* Should be able to take folling params
                 * userID | null
                 * startDate | null
                 * endDate | null
                 * type ( given / gived ) | return both ?
                 *
                 */

                return h.response({}).code(200);

            } catch (err) {

                log.warn(err);

                return h.response({
                    error: true,
                    code: err.code || 500,
                    message: err.message,
                    data: null
                }).code(err.code || 500);
            }
        }
    });





    async function start() {
        try {
            await server.start()
        } catch (err) {
            log.warn(err);
            process.exit(1);
        }
        log.info('Server running at:', server.info.uri);
    }
    start();

};
