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


const isFalse = (input: string) => (input === 'false' || input === 'no' || input === '0');
const isTrue = (input: string) => (input === 'true' || input === 'yes' || input === '1');

export function fixEmoji(input) {
    let inputFix = input
    if (!input.startsWith(':')) inputFix = `:${inputFix}`;
    if (!input.endsWith(':')) inputFix = `${inputFix}:`;
    return inputFix;
}


export function getBool(inputKey: string, defaultValue: boolean) {
    if (!inputKey) return defaultValue;
    const key = inputKey.toLowerCase();

    if (isFalse(key)) return false;
    if (isTrue(key)) return true;
    return defaultValue;
};

export function getNum(inputKey: string, defaultValue: number): number {
    if (!inputKey) return defaultValue;
    const integer = Number(inputKey);
    return !!integer ? integer : defaultValue;
};

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
            enable_decrement: getBool(process.env.ENABLE_DECREMENT, false),
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
            latest: getBool(process.env.THEME_LATEST, true),
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
            emoji_inc: fixEmoji(process.env.SLACK_EMOJI_INC || ':burrito:'),
            emoji_dec: fixEmoji(process.env.SLACK_EMOJI_DEC || ':rottenburrito:'),
            disable_emoji_dec: getBool(process.env.DISABLE_EMOJI_DEC, false),
            daily_cap: getNum(process.env.SLACK_DAILY_CAP, 5000),
            daily_dec_cap: getNum(process.env.SLACK_DAILY_DEC_CAP, 5000),
            enable_decrement: getBool(process.env.ENABLE_DECREMENT, true),
        },
        http: {
            http_port: getNum(process.env.HTTP_PORT, 3333),
            wss_port: getNum(process.env.WSS_PORT, 3334),
            web_path: process.env.WEB_PATH ? fixPath(process.env.WEB_PATH) : '/heyburrito/',
            api_path: process.env.API_PATH ? fixPath(process.env.API_PATH) : '/api/',
        },
        theme: {
            root: themeRootPath,
            url: process.env.THEME_URL || defaultTheme,
            path: process.env.THEME_PATH,
            latest: getBool(process.env.THEME_LATEST, false),
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
            enable_decrement: true,
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
            latest: getBool(process.env.THEME_LATEST, true),
            themeName: getThemeName(),
            themePath: getThemePath(),
        },
        misc: {
            slackMock: true,
        },
    },
};

export default config[env] ? config[env] : config.development;
