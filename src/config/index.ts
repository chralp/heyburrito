import path from 'path';
import { env, fixPath, mustHave } from '../lib/utils';

const root: string = path.normalize(`${__dirname}/../../`);
const themePath: string = `${root}www/themes/`;
const config = {
    production: {
        db: {
            db_driver: process.env.DATABASE_DRIVER || 'mongodb',
            db_url: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_URL') : '',
            db_name: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_DATABASE') : '',
        },
        slack: {
            bot_name: process.env.BOT_NAME || 'heyburrito',
            api_token: mustHave('SLACK_API_TOKEN'),
            emoji_inc: process.env.SLACK_EMOJI_INC || ':burrito:',
            emoji_dec: process.env.SLACK_EMOJI_DEC || ':rottenburrito:',
            enable_decrement: !!process.env.ENABLE_DECREMENT || true,
            daily_cap: process.env.SLACK_DAILY_CAP || 5,
        },
        http: {
            http_port: process.env.HTTP_PORT || 3333,
            wss_port: process.env.WSS_PORT || 3334,
            web_path: process.env.WEB_PATH ? fixPath(process.env.WEB_PATH) : '/heyburrito/',
            api_path: process.env.API_PATH ? fixPath(process.env.API_PATH) : '/api/',
        },
        misc: {
            slackMock: false,
            log_level: process.env.LOG_LEVEL || 'info',
            theme: process.env.THEME ? fixPath(process.env.THEME) : `${themePath}default/`,
        },
    },
    development: {
        db: {
            db_driver: process.env.DATABASE_DRIVER || 'mongodb',
            db_url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
            db_name: process.env.MONGODB_DATABASE || 'heyburrito',
        },
        slack: {
            bot_name: process.env.BOT_NAME || 'heyburrito',
            api_token: process.env.SLACK_API_TOKEN || 'asdasd',
            emoji_inc: process.env.SLACK_EMOJI_INC || ':burrito:',
            emoji_dec: process.env.SLACK_EMOJI_DEC || ':rottenburrito:',
            enable_decrement: !!process.env.ENABLE_DECREMENT || true,
            daily_cap: process.env.SLACK_DAILY_CAP || 5,
        },
        http: {
            http_port: process.env.HTTP_PORT || 3333,
            wss_port: process.env.WSS_PORT || 3334,
            web_path: process.env.WEB_PATH ? fixPath(process.env.WEB_PATH) : '/heyburrito/',
            api_path: process.env.API_PATH ? fixPath(process.env.API_PATH) : '/api/',
        },
        misc: {
            slackMock: false,
            log_level: process.env.LOG_LEVEL || 'debug',
            theme: process.env.THEME ? fixPath(process.env.THEME) : `${themePath}default/`,
        },
    },
};

export default config[env] ? config[env] : config.development;
