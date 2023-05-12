import config from "./config";
import BurritoStore from "./store/BurritoStore";
import LocalStore from "./store/LocalStore";
import { parseMessage } from "./lib/parseMessage";
import { validBotMention, validMessage, validReaction } from "./lib/validator";
import Rtm from "./slack/Rtm";
import Wbc from "./slack/Wbc";

const {
    enableDecrement,
    dailyCap,
    dailyDecCap,
    emojiInc,
    emojiDec,
    disableEmojiDec,
} = config.slack;

interface Emojis {
    type: string;
    emoji: string;
}

interface Updates {
    username: string;
    type: string;
}
const emojis: Array<Emojis> = [];

const incEmojis = emojiInc.split(",").map((emoji) => emoji.trim());
incEmojis.forEach((emoji: string) => emojis.push({ type: "inc", emoji }));

if (!disableEmojiDec) {
    const decEmojis = emojiDec.split(",").map((emoji) => emoji.trim());
    decEmojis.forEach((emoji: string) => emojis.push({ type: "dec", emoji }));
}

const giveBurritos = async (giver: string, updates: Updates[]) => {
    return updates.reduce(async (prev: any, burrito) => {
        return prev.then(async () => {
            if (burrito.type === "inc") {
                await BurritoStore.giveBurrito(burrito.username, giver);
            } else if (burrito.type === "dec") {
                await BurritoStore.takeAwayBurrito(burrito.username, giver);
            }
        });
    }, Promise.resolve());
};

const notifyUser = (user: string, message: string) => Wbc.sendDM(user, message);

const handleBurritos = async (giver: string, updates: Updates[]) => {
    if (!enableDecrement) {
        const burritos = await BurritoStore.givenBurritosToday(giver, "from");
        const diff = dailyCap - burritos;
        if (updates.length > diff) {
            notifyUser(
                giver,
                `${updates.length} 개의 국밥을 주는데 실패했습니다. 오늘 줄 수 국밥의 개수는 ${diff}개 입니다.`
            );
            return false;
        }
        if (burritos >= dailyCap) {
            return false;
        }
        await giveBurritos(giver, updates);
    } else {
        const givenBurritos = await BurritoStore.givenToday(
            giver,
            "from",
            "inc"
        );
        const givenRottenBurritos = await BurritoStore.givenToday(
            giver,
            "from",
            "dec"
        );
        const incUpdates = updates.filter((x) => x.type === "inc");
        const decUpdates = updates.filter((x) => x.type === "dec");
        const diffInc = dailyCap - givenBurritos;
        const diffDec = dailyDecCap - givenRottenBurritos;
        if (incUpdates.length) {
            if (incUpdates.length > diffInc) {
                notifyUser(
                    giver,
                    `${updates.length} 개의 국밥을 주는데 실패했습니다. 오늘 줄 수 국밥의 개수는 ${diffInc}개 입니다.`
                );
            } else {
                await giveBurritos(giver, incUpdates);
            }
        }
        if (decUpdates.length) {
            if (decUpdates.length > diffDec) {
                notifyUser(
                    giver,
                    `You are trying to give away ${updates.length} rottenburritos, but you only have ${diffDec} rottenburritos left today!`
                );
            } else {
                await giveBurritos(giver, decUpdates);
            }
        }
    }
    return true;
};

const start = () => {
    Rtm.on("slackMessage", async (event: any) => {
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

    Rtm.on("slackReaction", async (event: any) => {
        if (validReaction(event)) {
            const originalContent = await Wbc.fetchReactedMessage(
                event.item.channel,
                event.item.ts
            );
            const result = parseMessage(originalContent, emojis);
            if (result) {
                const { updates } = result;
                if (updates.length) {
                    await handleBurritos(event.user, updates);
                }
            }
        }
    });
};

export { handleBurritos, notifyUser, start };
