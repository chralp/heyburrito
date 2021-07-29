import BurritoStore from "../../src/store/BurritoStore";
import Score from "../../src/types/Score.interface";
import { ScoreAction, ScoreBoardRequest, ScoreBoardResult, UserScore } from "../models/score";

export async function addScores(scores: ScoreAction[]) {
    scores.forEach(score => {
        BurritoStore.giveBurrito(score.targetUserId, score.sourceUserId, new Date(), score.context.id, score.context.parentContextId)
    })
}

export async function getScoreboard(request: ScoreBoardRequest): Promise<ScoreBoardResult> {
    const stuff = await BurritoStore.getScoreBoard({listType: 'to', scoreType: 'inc'});
    return applyRequestFilters(request, stuff);
}

function applyRequestFilters(request: ScoreBoardRequest, scores: Score[]): ScoreBoardResult {
    let filteredScores: Score[] = scores;
    switch (request.context.scope) {
        case "team":
            filteredScores = scores.filter(score => score.parentContextId === request.context.id);
            break;
        case "channel":
        case "chat":
            filteredScores = scores.filter(score => score.contextId === request.context.id);
            break;
    }

    if (request.userId) {
        filteredScores = filteredScores.filter(score => score.to === request.userId)
    }
    const aggregatedUserScores: Map<string,UserScore> = new Map();
    filteredScores.forEach(score => {
        const userId = score.to;
        const prev = aggregatedUserScores.get(userId)?.score || 0;
        aggregatedUserScores.set(userId, {userId, score: prev + 1})
    })

    return {
        request,
        scores: Array.from(aggregatedUserScores.values())
    }
}
