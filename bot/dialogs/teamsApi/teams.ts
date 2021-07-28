
/**
 * Methods to fetch Teams stuff here
 */

import { TeamsChannelAccount, TeamsInfo, TurnContext } from "botbuilder";


/**
 * Returns ALL members from current context (group chat or team)
 * @param innerDc 
 * @returns 
 */
export async function getAllMembers(context: TurnContext) {
    var continuationToken;
    const members: TeamsChannelAccount[] = [];
    do {
        var pagedMembers = await TeamsInfo.getPagedMembers(context, 500, continuationToken);
        continuationToken = pagedMembers.continuationToken;
        members.push(...pagedMembers.members);
    }
    while(continuationToken !== undefined)
    return members;
}

export async function getDisplayName(context: TurnContext, userId: string) {
    return (await TeamsInfo.getMember(context, userId)).name
}

export async function getTeamName(context: TurnContext, teamId: string) {
    const info = await TeamsInfo.getTeamDetails(context, teamId);
    return info.name;
}

export async function getChannelName(context: TurnContext, teamId: string, channelId: string) {
    const teamChannels = await TeamsInfo.getTeamChannels(context, teamId);
    const channel = teamChannels.find(channel => channel.id === channelId)
    return channel?.name ?? "General";
}

export async function getChatName(context: TurnContext, chat: string) {
    return ""
}