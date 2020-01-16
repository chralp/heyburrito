import log from 'bog';
import config from './config';
import BurritoStore from './store/BurritoStore';
import LocalStore from './store/LocalStore';
import { parseMessage } from './lib/parseMessage';
import { validBotMention, validMessage } from './lib/validator';
import Rtm from './slack/Rtm';
import Wbc from './slack/Wbc';

interface Emojis {
    type: string;
    emoji: string;
}

const dailyCap: number = parseInt(config.slack.daily_cap);
const emojis: Array<Emojis> = [];

if (config.slack.emoji_inc) {
    const incEmojis = config.slack.emoji_inc.split(', ');
    incEmojis.forEach((emoji: string) => emojis.push({ type: 'inc', emoji }));
};

if (config.slack.emoji_dec) {
    const incEmojis = config.slack.emoji_dec.split(',');
    incEmojis.forEach((emoji: string) => emojis.push({ type: 'dec', emoji }));
};


export default () => {

    Rtm.on('slackMessage', (event: any) => {
        if (validMessage(event, emojis, LocalStore.getAllBots())) {
            if (validBotMention(event, LocalStore.botUserID())) {
                // Geather data and send back to user

            } else {
                const result = parseMessage(event, emojis);
                if (result) {
                    const { giver, updates } = result;
                    if (updates.length) {
                        handleBurritos(giver, updates);
                    };
                };
            };
        };
    });

    const handleBurritos = async (giver: string, updates) => {

        // Get given burritos today
        const burritos = await BurritoStore.givenBurritosToday(giver, 'from');
        log.info(`${giver} has given ${burritos} burritos today`);

        const diff = dailyCap - burritos

        if (updates.length > diff) {
            Wbc.sendDM(giver, `You are trying to give away ${updates.length} burritos, but you only have ${diff} burritos left today!`)
            log.info(`User ${giver} is trying to give ${updates.length}, but u have only ${diff} left`)
            return;
        };

        if (burritos >= dailyCap) {
            log.info(`Daily cap of ${dailyCap} reached`);
            return;
        };

        const a = updates.shift();


        if (a.type === 'inc') {
            await BurritoStore.giveBurrito(a.username, giver);
            if (updates.length) {
                handleBurritos(giver, updates);
            };

        } else if (a.type === 'dec') {

            if (config.slack.enable_decrement) {
                await BurritoStore.takeAwayBurrito(a.username, giver);
            };

            if (updates.length) {
                handleBurritos(giver, updates);
            };
        };
    };
}
