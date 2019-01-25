import { default as log } from 'bog';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import fs from 'fs';
import gitCloneRepo from 'git-clone-repo'
dotenv.config();

async function bootstrap() {

    // Configuration file to use
    const root: string = path.normalize(`${__dirname}/../`);

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
        if ((!x.value) && (x.required)) {
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
            if ((x.key === "MONGODB_URL" || "MONGODB_DATABASE") && !(x.value)) {
                log.warn(`You have to set ENV ${x.key}`)
                return x
            }
        })
        if (mongoDBKeys.length) {
            throw new Error('Missing ENV keys')
        }
    }

    const themeUrl = config.filter(x => (x.key === 'THEME') && (x.value))[0]
    const publicPath: string = `${root}www/themes/`;
    if (themeUrl) {
        const urlObj = url.parse(themeUrl.value);
        if (!urlObj.slashes) {
            log.warn('Invalid Theme URL')
        } else {
            const themeInstaller = await installTheme(urlObj, publicPath)

        }
    }

    const theme: string = ('THEME' in process.env) ? process.env.THEME : 'default';
}

function installTheme(urlObj, publicPath) {
    /*
      Test if URL is valid
      Parseurl
      - getRepoName
      check if repoName exists under themefolder
      if true
      cd git pull
      else
      git clone
    */
    const [, , project] = urlObj.pathname.split('/')
    if (!project) return false

    if (fs.existsSync(`${publicPath}${project}`)) {
        console.log("PATH EXITS")
    } else {
        console.log("PATH DOES NOT EXIST")
        gitCloneRepo(urlObj.pathname, {
            host: urlObj.host,
            destination: `${publicPath}${project}`
        });
    }

}

bootstrap()

export default bootstrap;
