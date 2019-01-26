

declare module Config {

    export interface doc {
        THEME: string;
        DATABASE_DRIVER: string;
        MONGODB_URL?: string;
        MONGODB_DATABASE?: string;
        SLACK_API_TOKEN: string;
        SLACK_DAILY_CAP: string;
        SLACK_EMOJI_INC: string;
        SLACK_EMOJI_DEC: string;
        BOT_NAME: string;

    }
}


export default Config;
