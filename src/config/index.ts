import { env, mustHave } from '../lib/utils/env';
import { getThemePath, getThemeName, themeRootPath, defaultTheme } from '../lib/utils/theme';
import { fixPath, root } from '../lib/utils/path';


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

const config: any = {
  db: {
    db_driver: process.env.DATABASE_DRIVER || 'file',
    db_fileName: `burrito-${process.env.NODE_ENV}.db`,
    db_path: process.env.DATABASE_PATH || `${root}data/`,
    db_url: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_URL') : '',
    db_name: (process.env.DATABASE_DRIVER === 'mongodb') ? mustHave('MONGODB_DATABASE') : '',
    db_uri: process.env.DATABASE_URI || `${process.env.MONGODB_URL}/${process.env.MONGODB_DATABASE}`,
  },
  slack: {
    bot_name: process.env.BOT_NAME || 'heyburrito',
    bot_emoji: process.env.BOT_EMOJI || ':burrito:',
    api_token: mustHave('SLACK_API_TOKEN'),
    emojiInc: fixEmoji(process.env.SLACK_EMOJI_INC || ':burrito:'),
    emojiDec: fixEmoji(process.env.SLACK_EMOJI_DEC || ':rottenburrito:'),
    disableEmojiDec: getBool(process.env.DISABLE_EMOJI_DEC, false),
    enableOverDraw: getBool(process.env.ENABLE_OVERDRAW, false),
    enableDecrement: getBool(process.env.ENABLE_DECREMENT, true),
    dailyCap: getNum(process.env.SLACK_DAILY_CAP, 5),
    dailyDecCap: getNum(process.env.SLACK_DAILY_DEC_CAP, 5),
    overdrawCap: getBool(process.env.ENABLE_OVERDRAW, false) ? getNum(process.env.SLACK_OVERDRAW_CAP, 5) : 0,
    slackMock: getBool(process.env.SLACK_MOCK, false),
  },
  http: {
    http_port: process.env.PORT || process.env.HTTP_PORT || 3333,
    wss_port: process.env.WSS_PORT || 3334,
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
  level: {
    enableLevel: getBool(process.env.ENABLE_LEVEL, false),
    scoreRotation: getNum(process.env.SCORE_ROTATION, 500)
  },
  misc: {
    log_level: process.env.LOG_LEVEL || 'info'
  }
}

export default config;
