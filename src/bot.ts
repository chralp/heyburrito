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

interface Updates {
    username: string;
    type: string;
}
const emojis: Array<Emojis> = [];


const { enable_decrement, daily_cap, daily_dec_cap, emoji_inc, emoji_dec, disable_emoji_dec } = config.slack

const incEmojis = emoji_inc.split(',');
incEmojis.forEach((emoji: string) => emojis.push({ type: 'inc', emoji }));

if (!disable_emoji_dec) {
    const incEmojis = emoji_dec.split(',');
    incEmojis.forEach((emoji: string) => emojis.push({ type: 'dec', emoji }));
};


const giveBurritos = async (giver: string, updates: Updates[]) => {
    return updates.reduce(async (prev: any, burrito) => {
        return prev.then(async () => {
            if (burrito.type === 'inc') {
                await BurritoStore.giveBurrito(burrito.username, giver);
            } else if (burrito.type === 'dec') {
                await BurritoStore.takeAwayBurrito(burrito.username, giver);
            }
        })
    }, Promise.resolve());
};

const notifyUser = (user: string, message: string) => {
    return Wbc.sendDM(user, message);
};


const handleBurritos = async (giver: string, updates: Updates[]) => {
    if (enable_decrement) {
        const burritos = await BurritoStore.givenBurritosToday(giver, 'from');
        const diff = daily_cap - burritos;
        if (updates.length > diff) {
            notifyUser(giver, `You are trying to give away ${updates.length} burritos, but you only have ${diff} burritos left today!`);
            return false;
        }
        if (burritos >= daily_cap) {
            return false;
        }
        await giveBurritos(giver, updates);
    } else {
        const givenBurritos = await BurritoStore.givenToday(giver, 'from', 'inc');
        const givenRottenBurritos = await BurritoStore.givenToday(giver, 'from', 'dec');
        const incUpdates = updates.filter(x => x.type === 'inc');
        const decUpdates = updates.filter(x => x.type === 'dec');
        const diffInc = daily_cap - givenBurritos;
        const diffDec = daily_dec_cap - givenRottenBurritos;
        if (incUpdates.length) {
            if (incUpdates.length > diffInc) {

                notifyUser(giver, `You are trying to give away ${updates.length} burritos, but you only have ${diffInc} burritos left today!`);
            } else {
                await giveBurritos(giver, incUpdates);
            }
        }
        if (decUpdates.length) {
            if (decUpdates.length > diffDec) {
                notifyUser(giver, `You are trying to give away ${updates.length} rottenburritos, but you only have ${diffDec} rottenburritos left today!`);
            } else {
                await giveBurritos(giver, decUpdates);
            }
        }
    }
    return true
};

const start = () => {
    Rtm.on('slackMessage', async (event: any) => {
        if (validMessage(event, emojis, LocalStore.getAllBots())) {
            if (validBotMention(event, LocalStore.botUserID())) {
                // Geather data and send back to user
            } else {
                const result = parseMessage(event, emojis);
                if (result) {
                    const { giver, updates } = result;
                    if (updates.length) {
                        await handleBurritos(giver, updates);
                    }
                }
            }
        }
    });
};

export {
    handleBurritos,
    notifyUser,
    start,
};
