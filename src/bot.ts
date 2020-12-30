import config from "./config";
import BurritoStore from "./store/BurritoStore";
import LocalStore from "./store/LocalStore";
import { parseMessage } from "./lib/parseMessage";
import { validBotMention, validMessage } from "./lib/validator";
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

const giveBurritos = async (
    giver: string,
    updates: Updates[],
    diff: number
) => {
    return updates.reduce(async (prev: any, burrito) => {
        return prev.then(async () => {
            if (burrito.type === "inc") {
                await BurritoStore.giveBurrito(burrito.username, giver);
            } else if (burrito.type === "dec") {
                await BurritoStore.takeAwayBurrito(burrito.username, giver);
            }
        });
    }, Promise.resolve());

    const burritosForEachUser = new Map<string, number>();

    updates.forEach((update: Updates) => {
        const prev = burritosForEachUser.get(update.username);
        burritosForEachUser.set(update.username, prev ? prev + 1 : 1);
    });

    let msgForGiver = "You gave ";

    Array.from(burritosForEachUser.keys()).forEach((receiver: string) => {
        const burritoCount = burritosForEachUser.get(receiver);
        const plural = burritoCount > 1;

        msgForGiver += `${burritoCount} waffle${
            plural ? "s" : ""
        } to <@${receiver}>,`;
        notifyUser(
            receiver,
            `You received ${burritoCount} waffle${
                plural ? "s" : ""
            } from <@${giver}>.`
        );
    });

    const leftBurritos = diff - updates.length;
    msgForGiver += ` you have ${leftBurritos} waffle${
        leftBurritos > 1 ? "s" : ""
    } left to give out today.`;
    notifyUser(giver, msgForGiver);
};

const notifyUser = (user: string, message: string) => Wbc.sendDM(user, message);

const handleBurritos = async (giver: string, updates: Updates[]) => {
    if (enableDecrement) {
        const burritos = await BurritoStore.givenBurritosToday(giver, "from");
        const diff = dailyCap - burritos;
        if (updates.length > diff) {
            notifyUser(
                giver,
                `You are trying to give away ${updates.length} waffles, but you only have ${diff} waffles left today!`
            );
            return false;
        }
        if (burritos >= dailyCap) {
            return false;
        }
        await giveBurritos(giver, updates, diff);
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
                    `You are trying to give away ${updates.length} waffles, but you only have ${diffInc} waffles left today!`
                );
            } else {
                await giveBurritos(giver, incUpdates, diffInc);
            }
        }
        if (decUpdates.length) {
            if (decUpdates.length > diffDec) {
                notifyUser(
                    giver,
                    `You are trying to give away ${updates.length} rottenwaffles, but you only have ${diffDec} rottenwaffles left today!`
                );
            } else {
                await giveBurritos(giver, decUpdates, diffDec);
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
};

export { handleBurritos, notifyUser, start };
