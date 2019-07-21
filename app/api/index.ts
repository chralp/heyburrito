import log from 'bog';
import BurritoStore from '../store/BurritoStore'
import mergeUserData from '../lib/mergeUserData';
import Route from './Route'

const apiPath: string = process.env.API_PATH || '/api/';


const response = (content: object, res, statusCode: number = 200) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(content), 'utf-8');

};

Route.add({
    method: 'GET',
    path: `${apiPath}scoreboard/{listType}`,
    handler: async (request: any, res: any) => {

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
            return response(data, res);

        } catch (err) {

            log.warn(err);

            return response({
                error: true,
                code: err.code || 500,
                message: err.message,
                data: null
            }, res, err.code || 500);
        }
    }
});

Route.add({
    method: 'GET',
    path: `${apiPath}userstats/{user}`,
    handler: async (request: any, res: any) => {

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

            return response(data, res)

        } catch (err) {

            log.warn(err);

            return response({
                error: true,
                code: err.code || 500,
                message: err.message,
                data: null
            }, res, err.code || 500);
        }
    }
});



Route.add({
    method: 'POST',
    path: `${apiPath}scoreboard/histogram`,
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



export default (req, res) => {

    const method: string = req.method.toLowerCase();
    const path: string = req.url;

    const { route, request, error } = Route.check({ method, path, req })

    if (error) return response({ error: true }, res, 500)
    route.handler(request, res)

};
