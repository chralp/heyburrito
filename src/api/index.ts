import log from 'loglevel';
import Route from './Route';
import { getScoreBoard, getUserStats, givenBurritosToday, getUserScore } from '../middleware';
import config from '../config';

// defaults
const apiPath: string = config.http.api_path;

const ALLOWED_LISTTYPES: string[] = [
  'to',
  'from',
];

const ALLOWED_SCORETYPES: string[] = [
  'inc',
  'dec',
];

interface Response {
  error: boolean;
  code?: number,
  message?: string | null,
  data?: object | null
};

/**
 * http response function
 * @param { object } content
 * @param { object } res
 * @params { number } statuscode
 */
const response = (content: Response, res: any, statusCode: number = 200): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(content), 'utf-8');
};

Route.add({
  method: 'GET',
  path: `${apiPath}userstats/today/{user}`,
  handler: async (request: any, res: any) => {
    try {
      const { user } = request.params;
      if (!user) {
        throw ({
          message: 'You must provide slack userid',
          code: 500,
        });
      }

      const score = await givenBurritosToday(user);

      const data = {
        error: false,
        code: 200,
        message: 'ok',
        data: score,
      };

      return response(data, res);
    } catch (err) {
      log.warn(err);
      return response({
        error: true,
        code: err.code || 500,
        message: err.message,
        data: null,
      }, res, err.code || 500);
    }
  },
});

Route.add({
  method: 'GET',
  path: `${apiPath}scoreboard/{listType}/{scoreTypeInput}`,
  handler: async (request: any, res: any) => {
    try {
      const { listType, scoreTypeInput } = request.params;

      const scoreType = scoreTypeInput || 'inc';

      if (!ALLOWED_LISTTYPES.includes(listType)) {
        throw ({
          message: 'Allowed listType is to or from',
          code: 400,
        });
      }

      if (!ALLOWED_SCORETYPES.includes(scoreType)) {
        throw ({
          message: 'Allowed scoreType is inc or dec',
          code: 400,
        });
      }

      const score = await getScoreBoard(listType, scoreType);

      const data = {
        error: false,
        code: 200,
        message: 'ok',
        data: score,
      };

      return response(data, res);
    } catch (err) {
      log.warn(err);
      return response({
        error: true,
        code: err.code || 500,
        message: err.message,
        data: null,
      }, res, err.code || 500);
    }
  },
});

/**
 * Add route for userScore
 */
Route.add({
  method: 'GET',
  path: `${apiPath}userscore/{user}/{listType}/{scoreType}`,
  handler: async (request: any, res: any) => {
    try {
      const { user: userId, listType, scoreType } = request.params;

      if (!userId) {
        throw ({
          message: 'You must provide slack userid',
          code: 500,
        });
      }

      if (!ALLOWED_LISTTYPES.includes(listType)) {
        throw ({
          message: 'Allowed listType is to or from',
          code: 400,
        });
      }

      if (!ALLOWED_SCORETYPES.includes(scoreType)) {
        throw ({
          message: 'Allowed scoreType is inc or dec',
          code: 400,
        });
      }

      const { ...result } = await getUserScore(userId, listType, scoreType);

      const data = {
        error: false,
        code: 200,
        message: 'ok',
        data: {
          ...result,
        },
      };
      return response(data, res);
    } catch (err) {
      log.warn(err);
      return response({
        error: true,
        code: err.code || 500,
        message: err.message,
        data: null,
      }, res, err.code || 500);
    }
  },
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

      if (!userId) {
        throw ({
          message: 'You must provide slack userid',
          code: 500,
        });
      }

      const { ...result } = await getUserStats(userId);

      const data = {
        error: false,
        code: 200,
        message: 'ok',
        data: {
          ...result,
        },
      };
      return response(data, res);
    } catch (err) {
      log.warn(err);
      return response({
        error: true,
        code: err.code || 500,
        message: err.message,
        data: null,
      }, res, err.code || 500);
    }
  },
});

Route.add({
  method: 'POST',
  path: `${apiPath}/histogram`,
  handler: async (request: any, res: any) => {
    try {
      /* Should be able to take folling params
       * userID | null
       * startDate | null
       * endDate | null
       * type ( given / gived ) | return both ?
       *
       */
      const data = {
        error: false,
        code: 200,
        message: null,
        data: null,
      };
      return response(data, res);
    } catch (err) {
      log.warn(err);
      return response({
        error: true,
        code: err.code || 500,
        message: err.message,
        data: null,
      }, res, err.code || 500);
    }
  },
});

export default (req: any, res: any) => {
  const method: string = req.method.toLowerCase();
  const path: string = req.url;
  const { route, request, error } = Route.check({ method, path, req });
  if (error) return response({ error: true }, res, 500);
  return route.handler(request, res);
};
