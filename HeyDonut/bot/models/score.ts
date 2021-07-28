
/**
 * Represents user's total score
 */
export interface UserScore {
    userId: string;
    score: number;
}

/**
 * Represents context of the score
 * NOTE: the parentContextId is here to help aggregate scores in a team from different channels / aggregate all channel and chat scores
 */
export interface ScoreContext {
    scope:  "Channel" | "Chat" 
    id: string; // channel id | conversation id
    parentContextId: string; // tenantId (for chats) or teamId (for channels)
    tenantId: string;
}

/**
 * Represents user's total score in a given context
 */
export interface ScoreInContext {
    userScore: UserScore;
    context: ScoreContext;
}

type ScoreActionType = "inc" | "dec" | "reset"

/** Represents action user can take on another user's score */
export interface ScoreAction {
    type: ScoreActionType;
    context: ScoreContext;
    targetUserId: string;
    sourceUserId: string;
}

export type ScoreBoardRequestScope = "team" | "channel" | "global" | "orgtree" | "chat";

/**
 * Scoreboard request. 
 * If userId is present, score of THAT USER will be returned in that context.
 * If userId is missing, will return the score for the entire requested context
 */
export interface ScoreBoardRequest {
    context: {
        scope: ScoreBoardRequestScope,
        id: string; // teamId, channelId, tenantId, orgtree root user id, chatId
    },
    userId?: string;
}