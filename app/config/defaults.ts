import path from 'path'
const root: string = path.normalize(`${__dirname}/../../`);

const themePath: string = `${root}www/themes/`;

/**
 * Check if string starts and ends with slash
 * If not, then slash will be added
 */
const fixPath = (path: string) => {
    if (!path.startsWith('/')) path = `/${path}`
    if (!path.endsWith('/')) path = `${path}/`
    return path
};


export default {
    THEME: process.env.THEME ? fixPath(process.env.THEME) : `${themePath}default/`,
    SLACK_EMOJI_INC: process.env.SLACK_EMOJI_INC || ':burrito:',
    SLACK_DAILY_CAP: process.env.SLACK_DAILY_CAP || 5,
    API_PATH: process.env.API_PATH ? fixPath(process.env.API_PATH) : '/api/',
    WEB_PATH: process.env.WEB_PATH ? fixPath(process.env.WEB_PATH) : '/heyburrito/',
    HTTP_PORT: process.env.HTTP_PORT || 3333,
    WSS_PORT: process.env.WSS_PORT || 3334,
};
