import * as log from 'bog';
import {
    env,
    fixPath,
    mustHave,
    themeRootPath,
    defaultTheme,
    root,
    getThemePath,
    getThemeName
} from '../lib/utils';

const config = {
    production: {
        db: {
            db_driver: process.env.DATABASE_DRIVER || 'file',
            db_fileName: 'burrito-prod.db',
            db_path: process.env.DATABASE_PATH || `${root}data/`,
            db_url: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_URL') : '',
            db_name: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_DATABASE') : '',
            db_uri: process.env.DATABASE_URI || `${this.db_path}/${this.db_name}`,
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
        theme: {
            root: themeRootPath,
            url: process.env.THEME_URL || defaultTheme,
            path: process.env.THEME_PATH,
            latest: process.env.THEME_LATEST || false,
            themeName: getThemeName(),
            themePath: getThemePath(),
        },
        misc: {
            slackMock: false,
            log_level: log.level(process.env.LOG_LEVEL || 'info')
        },
    },
    development: {
        db: {
            db_driver: process.env.DATABASE_DRIVER || 'file',
            db_fileName: 'burrito-dev.db',
            db_path: process.env.DATABASE_PATH || `${root}data/`,
            db_url: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_URL') : '',
            db_name: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_DATABASE') : '',
            db_uri: process.env.DATABASE_URI || `${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`,
        },
        slack: {
            bot_name: process.env.BOT_NAME || 'heyburrito',
            api_token: process.env.SLACK_API_TOKEN || '',
            emoji_inc: process.env.SLACK_EMOJI_INC || ':burrito:',
            emoji_dec: process.env.SLACK_EMOJI_DEC || ':rottenburrito:',
            daily_inc_cap: process.env.SLACK_DAILY_INC_CAP || 5,
            daily_dec_cap: process.env.SLACK_DAILY_DEC_CAP || 5,
            enable_decrement: !!process.env.ENABLE_DECREMENT || false,
        },
        http: {
            http_port: process.env.HTTP_PORT || 3333,
            wss_port: process.env.WSS_PORT || 3334,
            web_path: process.env.WEB_PATH ? fixPath(process.env.WEB_PATH) : '/heyburrito/',
            api_path: process.env.API_PATH ? fixPath(process.env.API_PATH) : '/api/',
        },
        theme: {
            root: themeRootPath,
            url: process.env.THEME_URL || defaultTheme,
            path: process.env.THEME_PATH,
            latest: process.env.THEME_LATEST || false,
            themeName: getThemeName(),
            themePath: getThemePath(),
        },
        misc: {
            slackMock: true,
            log_level: log.level('debug')
        },
    },
    testing: {
        db: {
            db_driver: process.env.DATABASE_DRIVER || 'file',
            db_fileName: 'burrito-test.db',
            db_path: process.env.DATABASE_PATH || `${root}data/`,
            db_url: '',
            db_name: '',
        },
        slack: {
            bot_name: process.env.BOT_NAME || 'heyburrito',
            api_token: process.env.SLACK_API_TOKEN || '',
            emoji_inc: process.env.SLACK_EMOJI_INC || ':burrito:',
            emoji_dec: process.env.SLACK_EMOJI_DEC || ':rottenburrito:',
            enable_decrement: !!process.env.ENABLE_DECREMENT || false,
            daily_cap: process.env.SLACK_DAILY_CAP || 5,
        },
        http: {
            http_port: process.env.HTTP_PORT || 3333,
            wss_port: process.env.WSS_PORT || 3334,
            web_path: process.env.WEB_PATH ? fixPath(process.env.WEB_PATH) : '/heyburrito/',
            api_path: process.env.API_PATH ? fixPath(process.env.API_PATH) : '/api/',
        },
        theme: {
            root: themeRootPath,
            url: process.env.THEME_URL || defaultTheme,
            path: process.env.THEME_PATH,
            latest: process.env.THEME_LATEST || false,
            themeName: getThemeName(),
            themePath: getThemePath(),
        },
        misc: {
            slackMock: true,
        },
    },
};

export default config[env] ? config[env] : config.development;
