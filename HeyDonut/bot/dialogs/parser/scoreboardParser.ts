/**
 * This file contains methods to parse stuff from user message
 */

 import { Activity } from "botbuilder";
 import { ScoreBoardRequest, ScoreBoardRequestScope } from "../../models/score";
 import { userMentions, getContext } from "./utils";
 
 const SCOREBOARD_KEYWOARDS = ["leaderboard", "scoreboard", "show donuts", "show scores"];
 const SCOREBOARD_CONTEXT_KEYWORDS: ScoreBoardRequestScope[] = ["team", "channel", "chat", "orgtree", "global"];
 
 
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
         if (scope === "global" && !userId) {
             throw "Mention someone to get ther score!"
         }
 
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