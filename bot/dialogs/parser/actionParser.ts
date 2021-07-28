/**
 * This file contains methods to parse "action" requests from user message
 */

import { Activity } from "botbuilder";
import { ScoreAction } from "../../models/score";
import { userMentions, getContext } from "./utils";

function hasDonut(activity: Activity) {
    // naive check for Teams donut emoji
    const fullContentText = activity.text + activity.attachments.map(a => a.content).join(";")
    return fullContentText.includes('title="Doughnut"')
}

export function parseScoreActions(activity: Activity, requireDonutInMessage: boolean): ScoreAction[] {
    if (requireDonutInMessage && !hasDonut(activity)) {
        throw "Donut missing from message!"
    }
    const mentions = userMentions(activity);
    const context = getContext(activity);
    const sourceUserId = activity.from.id;
    return mentions.map(mention => ({
        context,
        sourceUserId,
        targetUserId: mention.mentioned.id,
        type: "inc"
    }))
}