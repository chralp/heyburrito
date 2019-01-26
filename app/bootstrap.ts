import { default as log } from 'bog';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import fs from 'fs';
import gitCloneRepo from 'git-clone-repo'
dotenv.config();
// Configuration file to use
const root: string = path.normalize(`${__dirname}/../`);
const publicPath: string = `${root}www/themes/`;

async function bootstrap() {


    // Log level
    const debugMode: boolean = (process.env.DEBUG || process.env.ENV === 'development') ? true : false
    if (debugMode) log.level('debug');

    const config = [
        {
            key: "THEME",
            value: process.env.THEME,
            required: false
        },
        {
            key: "DATABASE_DRIVER",
            value: process.env.DATABASE_DRIVER,
            required: true
        },
        {
            key: "MONGODB_URL",
            value: process.env.MONGODB_URL,
            required: false
        },
        {
            key: "MONGODB_DATABASE",
            value: process.env.MONGODB_DATABASE,
            required: false
        },
        {
            key: "SLACK_API_TOKEN",
            value: process.env.SLACK_API_TOKEN,
            required: true
        },
        {
            key: "SLACK_DAILY_CAP",
            value: process.env.SLACK_DAILY_CAP,
            required: false
        },
        {
            key: "SLACK_EMOJI_INC",
            value: process.env.SLACK_EMOJI_INC,
            required: true
        },
        {
            key: "SLACK_EMOJI_DEC",
            value: process.env.SLACK_EMOJI_DEC,
            required: false
        },
        {
            key: "BOT_NAME",
            value: process.env.BOT_NAME,
            required: true
        }
    ]

    const firstCheck = config.filter(x => {
        if ((!x.value) && !!(x.required)) {
            log.warn(`You have to set ENV ${x.key}`)

            return x
        }
    })
    if (firstCheck.length) {
        throw new Error('Missing ENV keys')
    }


    // We need mongodb_url and mongodb_database if databasedriver is set to mongodb
    const mongodb = config.filter(x => (x.key === "DATABASE_DRIVER") && (x.value === "mongodb"))
    if (mongodb) {
        // Check so keys for mongodb is set
        const mongoDBKeys = config.filter(x => {
            if ((x.key === "MONGODB_URL" || x.key === "MONGODB_DATABASE") && !(x.value)) {
                log.warn(`You have to set ENV ${x.key}`)
                return x
            }
        })
        if (mongoDBKeys.length) {
            throw new Error('Missing ENV keys')
        }
    }


    /*
     * Set theme
     */
    let theme: string;
    const envThemeUrl = config.filter(x => (x.key === 'THEME') && (x.value))[0]

    if (envThemeUrl) {
        // Theme set in env
        // Check if valid Url
        console.log("THEME URL SET")
        const urlObj = url.parse(envThemeUrl.value);
        if (!urlObj.slashes) {
            log.warn('Invalid Theme URL, defaulting to heyburrito default theme')
            theme = `${publicPath}default`

        } else {
            theme = await installTheme(urlObj, publicPath)
        }
    } else {
        theme = `${publicPath}default`
    }
    console.log("theme", theme)
}

async function cloneRepo(urlObj, dest: string) {
    await gitCloneRepo(urlObj.pathname, {
        host: urlObj.host,
        destination: dest
    });
    return dest
}


function installTheme(urlObj, publicPath: string) {

    // Get value that we want
    const [, , project] = urlObj.pathname.split('/')

    // Unless project default theme
    //if (!project) return false
    const themePath = `${publicPath}${project}`
    if (fs.existsSync(themePath)) {
        log.info('Theme installed, setting theme...')
        return themePath
    } else {
        log.info('Theme not installed, installing..')
        const dest = themePath
        return cloneRepo(urlObj, dest).then((data) => {
            // data = themePath
            return data
        })
    }
}

bootstrap()

export default bootstrap;
