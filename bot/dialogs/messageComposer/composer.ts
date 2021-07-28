/**
 * This file contains methods for crafting nice bot answers
 */

import { AdaptiveCard, CardElement } from "adaptivecards";
import { CardFactory, TeamsChannelData, TurnContext } from "botbuilder";
import { ScoreAction, ScoreBoardResult, ScoreInContext } from "../../models/score";
import { getChannelName, getDisplayName, getTeamName } from "../teamsApi/teams";
import { createScoreboardCard } from "./cardBuilder";

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

function getTeamId(context: TurnContext): string {
    if (!context) {
        throw new Error('Missing context parameter');
    }

    if (!context.activity) {
        throw new Error('Missing activity on context');
    }

    const channelData = context.activity.channelData as TeamsChannelData;
    const team = channelData && channelData.team ? channelData.team : undefined;
    const teamId = team && typeof team.id === 'string' ? team.id : undefined;
    return teamId;
}


export async function createCardFromScoreboardResults(context: TurnContext, scoreboard: ScoreBoardResult) {
    // TODO based on the #ppl on the scorecard do a full team members fetch instead of individual display names
    const userScoreAndNamePromises = scoreboard.scores.map(score => 
        getDisplayName(context, score.userId).then(displayName => ({
            displayName,
            ...score
        }))
    );

    let contextType = "";
    let contextDisplayName = "";
    switch (scoreboard.request.context.scope) {
        case "channel": 
            contextType = "channel"
            contextDisplayName = await getChannelName(context, getTeamId(context), scoreboard.request.context.id);
            break;

        case "team": 
            contextType = "team"
            contextDisplayName = await getTeamName(context, scoreboard.request.context.id);
            break;
    }

    const userNamesAndScores = await Promise.all(userScoreAndNamePromises);
    const card = createScoreboardCard(userNamesAndScores, contextType, contextDisplayName);
    return CardFactory.adaptiveCard(card);
}
