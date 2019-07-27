import log from 'bog';
import Route from './Route'
import Middleware from '../Middleware';
import config from '../config'

//Types
import Http from '../types/Http'

// defaults
const apiPath: string = config('API_PATH');
const ALLOWED_LISTTYPES: string[] = [
    'given',
    'givers'
];

/**
 * http response function
 * @param { object } content
 * @param { object } res
 * @params { number } statuscode
 */
const response = (content: Http.Response, res: any, statusCode: number = 200): void => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(content), 'utf-8');
};

Route.add({
    method: 'GET',
    path: `${apiPath}scoreboard/{listType}`,
    handler: async (request: any, res: any) => {

        try {

            const { listType } = request.params;

            if (!ALLOWED_LISTTYPES.includes(listType)) throw ({
                message: 'Allowed listType is given or givers',
                code: 400,
            });

            const scoreType: string = listType === 'given' ? 'to' : 'from';
            const score = await Middleware.getUserScore({ scoreType });

            const data = {
                error: false,
                code: 200,
                message: null,
                data: score,
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

/**
 * Add route for userstats
 */
Route.add({
    method: 'GET',
    path: `${apiPath}userstats/{user}`,
    handler: async (request: any, res: any) => {

        try {

            const { user: userId } = request.params;

            if (!userId.length) throw ({
                message: 'You must provide slack userid',
                code: 500
            });

            const { user, gived, givers }: any = await Middleware.getUserStats(userId);

            const data = {
                error: false,
                code: 200,
                message: null,
                data: {
                    user,
                    gived,
                    givers,
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
