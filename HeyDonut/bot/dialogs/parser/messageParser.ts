/**
 * This file contains methods to parse stuff from user message
 */

import { Activity, RoleTypes, TurnContext } from "botbuilder";
import { ScoreBoardRequest, ScoreBoardRequestScope, ScoreContext, ScoreInContext } from "../../models/score";

const SCOREBOARD_KEYWOARDS = ["leaderboard", "scoreboard", "show donuts", "show scores"];
const SCOREBOARD_CONTEXT_KEYWORDS: ScoreBoardRequestScope[] = ["team", "channel", "chat", "orgtree", "global"];

function hasDonut(activity: Activity) {
    // naive check for Teams donut emoji
    const fullContentText = activity.text + activity.attachments.map(a => a.content).join(";")
    return fullContentText.includes('title="Doughnut"')
}

/**
 * Returns users mentioned in the message (excluding the bot itself)
 */
function userMentions(activity: Activity) {
    const mentions = TurnContext.getMentions(activity);
    const bot = activity.recipient;
    return mentions.filter(mention => mention.mentioned.id !== bot.id && (mention.mentioned.role !== RoleTypes.Bot)&& (mention.mentioned.role !== RoleTypes.Skill))
}

function getContext(activity: Activity): ScoreContext|undefined {
    const conversation = activity.conversation;
    const channel = activity.channelData
    const tenantId = conversation.tenantId
    const isGroupChat = conversation.conversationType === "groupChat";
    const isChannel = conversation.conversationType === "channel" && channel && channel.team
    if (!isGroupChat && !isChannel) {
        throw "You can only give out donuts in a group chat or a channel";
    }
    if (!tenantId) {
        throw "tenant id missing"
    }
    const context: ScoreContext = {
        scope: isGroupChat ? "Chat" : "Channel",
        id: isGroupChat ? conversation.id : channel.team.id,
        tenantId: conversation.tenantId,
        parentContextId: isGroupChat ? conversation.tenantId : channel.channel.id
    }
    return context;
}

export function parseNewScores(activity: Activity, requireDonut: boolean): ScoreInContext[] {
    if (requireDonut && !hasDonut(activity)) {
        throw "Donut missing from message!"
    }
    const mentions = userMentions(activity);
    const context = getContext(activity);
    return mentions.map(mention => ({
        context,
        userScore: {
            userId: mention.mentioned.id,
            score: 1
        }
    }))
}

export function isScoreboardRequest(activity: Activity) {
    const messageText = activity.text.toLowerCase();
    return SCOREBOARD_KEYWOARDS.some(keyword => messageText.includes(keyword));
}

function getScoreboardRequestScope(activity: Activity): ScoreBoardRequestScope {
    const messageText = activity.text.toLowerCase();
    let context: ScoreBoardRequestScope|undefined;
    SCOREBOARD_CONTEXT_KEYWORDS.forEach(keyword => {
        if (messageText.includes(keyword)) {
            context = keyword;
        }
    })
    if (!context) {
        const guessContextFromActivity = getContext(activity);
        switch (guessContextFromActivity.scope) {
            case "Chat" :
                context = "chat";
                break;
            case "Channel": 
                context = "channel";
                break;
        }
    }
    if (!context) {
        throw `Cannot infer the context of the scoreboard request. Try using the following keywords ${SCOREBOARD_CONTEXT_KEYWORDS.join()}`
    }
    return context;
}

function getScopeId(activity: Activity, scope: ScoreBoardRequestScope) {
    switch (scope) {
        case "chat": return activity.conversation.id;
        case "channel": return activity.channelData.team.id;
        case "team": return activity.channelData.channel.id;
        case "global": return activity.conversation.tenantId;
        case "orgtree": {
            const mention = userMentions(activity)[0];
            if (!mention) {
                throw "orgtree request requires mentioning a user!"
            }
            return mention.mentioned.id;
        }
    }
}

function getUserId(activity: Activity, scope: ScoreBoardRequestScope) {
    const mentions = userMentions(activity);
    switch (scope) {
        case "orgtree": {
            if (mentions.length < 2) { // if only one user mentioned, that's the "root" of the orgtree, not a user
                return undefined;
            }
        }
        case "global": return activity.conversation.tenantId
        default: 
            return mentions.pop()?.mentioned?.id;
    }
}

export function parseScoreboardRequest(activity: Activity): ScoreBoardRequest | undefined {
      if (isScoreboardRequest(activity)) {
        const scope = getScoreboardRequestScope(activity);
        const scopeId = getScopeId(activity, scope); 

        if (!scopeId) {
            throw `Cannot figure out which ${scope} you mean`
        }

        const userId = getUserId(activity, scope);

        return {
            context: {
                id: scopeId,
                scope
            },
            userId
        }
    }

    return undefined;
}