import * as log from "bog";
import config from "../config";

interface WbcParsed {
    id: string;
    name: string;
    avatar: string;
    memberType: string;
}

class Wbc {
    wbc: any;

    register(wbc: any) {
        this.wbc = wbc;
    }

    async fetchSlackUsers() {
        const users: WbcParsed[] = [];
        const bots: WbcParsed[] = [];

        log.info("Fetching slack users via wbc");
        const result = await this.wbc.users.list();
        result.members.forEach((x: any) => {
            // reassign correct array to arr
            const arr = x.is_bot ? bots : users;
            arr.push({
                id: x.id,
                name: x.is_bot ? x.name : x.real_name,
                memberType: x.is_restricted ? "guest" : "member",
                avatar: x.profile.image_48,
            });
        });
        return { users, bots };
    }

    async sendDM(username: string, text: string) {
        const { channel } = await this.wbc.conversations.open({
            users: username,
        });

        const res = await this.wbc.chat.postMessage({
            text,
            channel: channel.id,
            username: config.slack.bot_name,
        });
        if (res.ok) {
            log.info(`Notified user ${username}`);
        }
    }
}

export default new Wbc();
