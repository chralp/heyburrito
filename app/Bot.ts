import { default as log } from 'bog';
import { parseMessage } from './lib/parseMessage';
import { validBotMention, validMessage } from './lib/validator';
import storeminator from './lib/storeminator';

// interfaces
import EmojiInterface from './types/Emoji.interface';
import SlackMessageInterface from './types/SlackMessage.interface';
import UserInterface from './types/User.interface';
import { RTMClient } from '@slack/client';

const emojis: Array<EmojiInterface> = [];

if (process.env.SLACK_EMOJI_INC) {
    const incEmojis = process.env.SLACK_EMOJI_INC.replace(/'/gi, '').split(', ');
    incEmojis.forEach(emoji => emojis.push({ type: 'inc', emoji }));
}

if (process.env.SLACK_EMOJI_DEC) {
    const incEmojis = process.env.SLACK_EMOJI_DEC.replace(/'/gi, '').split(',');
    incEmojis.forEach(emoji => emojis.push({ type: 'dec', emoji }));
}
class Bot {

    rtm;
    botUserID: Function;
    getUserStats: Function;
    allBots: Function;

    constructor(
        rtm,
        botUserID: Function,
        getUserStats: Function,
        allBots: Function,
    ) {
        this.rtm = rtm;
        this.botUserID = botUserID;
        this.getUserStats = getUserStats;
        this.allBots = allBots;
    }

    sendToUser(username: string, data: UserInterface) {
        log.info('Will send to user', username);
        log.info('With data', data);
    }

    listener(): void {
        log.info('Listening on slack messages');
        this.rtm.on('message', (event: SlackMessageInterface) => {
            this.handleEvent(event)
        })
    }

    handleEvent(event) {
        if ((!!event.subtype) && (event.subtype === 'channel_join')) {
            log.info('Joined channel', event.channel);
        }

        if (event.type === 'message') {
            if (validMessage(event, emojis, this.allBots)) {
                if (validBotMention(event, this.botUserID)) {
                    // Geather data and send back to user
                    this.getUserStats(event.user).then((res) => {
                        this.sendToUser(event.user, res);
                    });
                } else {
                    const result = parseMessage(event, emojis);
                    if (result) {
                        storeminator(result);
                    }
                }
            }
        }

    }
}

export default Bot;
