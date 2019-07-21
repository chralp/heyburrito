import log from 'bog';
import config from '../config'

import path from 'path';
import url from 'url';
import fs from 'fs';
import gitCloneRepo from 'git-clone-repo'



// Required ENV keys
const required: string[] = [
    'BOT_NAME',
    'SLACK_API_TOKEN',
    'SLACK_EMOJI_INC',
    'DATABASE_DRIVER',
    'THEME',
    'SLACK_EMOJI_INC',
    'SLACK_DAILY_CAP',
    'API_PATH',
    'WEB_PATH',
    'HTTP_PORT',
    'WSS_PORT'
];


export default () => {

    log.info('Checking that all env keys exists');


    // check if process.env.THEME is a URL
    // If url then install theme and return THEME_PATH as path to theme

    // Check that required ENV keys exists
    required.forEach(x => config(x));

    // Check if required subkeys exists if mongodb is set DATABASE_DRIVER
    const envDB = config('DATABASE_DRIVER');
    if (envDB == 'mongodb') {
        if (!config('MONGODB_URL')) throw new Error('Missing required env key MONGODB_URL');
        if (!config('MONGODB_DATABASE')) throw new Error('Missing required env key MONGODB_DATABASE');
    }

};
