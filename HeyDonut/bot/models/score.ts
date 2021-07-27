
/**
 * Represents user's score
 */
export interface UserScore {
    userId: string;
    score: number;
}

/**
 * Represents context of the score
 */
export interface ScoreContext {
    scope:  "Channel" | "Chat" 
    id: string; // channel id | conversation id
    parentContextId: string; // tenantId (for chats) or teamId (for channels)
    tenantId: string;
}

export interface ScoreInContext {
    userScore: UserScore;
    context: ScoreContext;
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