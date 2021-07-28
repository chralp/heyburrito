/**
 * This file contains methods for crafting nice bot answers
 */

import { TurnContext } from "botbuilder";
import { ScoreAction, ScoreInContext } from "../../models/score";
import { getDisplayName } from "../teamsApi/teams";

export async function donutGivenConfirmationMesssage(context: TurnContext, scores: ScoreAction[]) {
    const sender = context.activity.from.id;
    const recipients = scores.map(score => score.targetUserId);

    const [senderDisplayName, recipientDisplayNames] = await Promise.all([
        getDisplayName(context, sender), 
        Promise.all(recipients.map(recipient => getDisplayName(context, recipient)))]);

    // todo generate random funnny stuff.
    const flavorMessage = getDonutPuns();
    return `${senderDisplayName} gave a 🍩 to ${recipientDisplayNames.join()}! ${flavorMessage}`;
}

function getDonutPuns() {
    const randomTextList = [
        "There’s a 100% chance of sprinkles today",
        "You've got this, donut give up!",
        "Donut underestimate the power of baked goods.",
        "Oh my, that's out-glaze-ous!",
        "You are a-glaze-ing.",
        "You drive me glaze-y.",
        "Dough you like donuts? I dough!",
        "I just don't dough how you do it!",
        "Donut be Jelly.",
        "Donut give up!"
    ]
    const rand = Math.floor(Math.random() * randomTextList.length)
    return randomTextList[rand];
}

function getDonutPunsLong() {
    const randomTextList = [
        "What kind of donuts fly? Plain ones!",
        "How busy was the donuts day? It was jam packed!",
        "What do donuts think about donut puns? They donut like them!",
        "(Why did the donut go to the dentist? It needed a filling!"
    ]   
}