import { default as log } from 'bog'
import path from 'path'

// Set defaults
const root: string = path.normalize(`${__dirname}/../../`);
const themePath: string = `${root}www/themes/`;

// Check if key exist as processEnv
const inEnv = (key: string) => ((key in process.env) ? process.env[key] : null);

// Required ENV keys
const required: string[] = ['BOT_NAME', 'SLACK_API_TOKEN', 'SLACK_EMOJI_INC', 'DATABASE_DRIVER'];


function config(key: string) {

    let envKey: string = inEnv(key);

    if (!(envKey) && (required.includes(key))) {
        throw Error(`Missing key ${key}`)
    }

    if (key === "THEME") {
        // Check if url to theme is provided, if so then download and return right theme path
        envKey = `${themePath}default/`
        log.info("Setting THEME to default theme")
    }

    if ((key === "SLACK_DAILY_CAP") && !(envKey)) {
        log.info("Setting SLACK_DAILY_CAP to 5")
        envKey = "5"
    }

    if ((key === "DATABASE_DRIVER") && (envKey === "mongodb")) {
        if (!inEnv("MONGODB_URL") || !(inEnv("MONGODB_DATABASE"))) {
            throw Error(`Missing mongodb url or database`)
        }
    }

    return envKey
}

export default config;
