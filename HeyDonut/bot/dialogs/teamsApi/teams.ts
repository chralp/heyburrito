
/**
 * Methods to fetch Teams stuff here
 */

import { TeamsInfo, TurnContext } from "botbuilder";


/**
 * Returns ALL members from current context (group chat or team)
 * @param innerDc 
 * @returns 
 */
export async function getAllMembers(context: TurnContext) {
    var continuationToken;
    var members = [];
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