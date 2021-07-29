import { Activity, TurnContext, RoleTypes } from "botbuilder";
import { ScoreContext } from "../../models/score";


/**
 * Returns users mentioned in the message (excluding the bot itself)
 */
 export function userMentions(activity: Activity) {
    const mentions = TurnContext.getMentions(activity);
    const bot = activity.recipient;
    return mentions.filter(mention => mention.mentioned.id !== bot.id && (mention.mentioned.role !== RoleTypes.Bot)&& (mention.mentioned.role !== RoleTypes.Skill))
}

export function getContext(activity: Activity): ScoreContext|undefined {
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
        id: isGroupChat ? conversation.id : channel.channel.id,
        tenantId: conversation.tenantId,
        parentContextId: isGroupChat ? conversation.tenantId : channel.team.id
    }
    return context;
}