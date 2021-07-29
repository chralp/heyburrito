import { Activity, TurnContext } from "botbuilder";
import { ComponentDialog, DialogContext } from "botbuilder-dialogs";
import { addScores, getScoreboard } from "../data/donutrepository";
import { ScoreBoardRequest } from "../models/score";
import { createCardFromScoreboardResults, donutGivenConfirmationMesssage, getDonutPunsLong, getInfo } from "./messageComposer/composer";
import { parseScoreActions } from "./parser/actionParser";
import { isScoreboardRequest, parseScoreboardRequest } from "./parser/scoreboardParser";
import { getAllMembers } from "./teamsApi/teams";

export class RootDialog extends ComponentDialog {
  constructor(id: string) {
    super(id);
  }

  async onBeginDialog(innerDc: DialogContext, options: {} | undefined) {
    const result = await this.triggerCommand(innerDc);
    if (result) {
      return result;
    }

    return await super.onBeginDialog(innerDc, options);
  }

  async onContinueDialog(innerDc: DialogContext) {
    return await super.onContinueDialog(innerDc);
  }

  isInfoRequest(innerDc: DialogContext) {
    const text = innerDc.context.activity.text;
    return text.includes("info") || text.includes("intro");
  }

  isJokeRequest(innerDc: DialogContext) {
    const text = innerDc.context.activity.text;
    return text.includes("joke")
  }


  async triggerCommand(innerDc: DialogContext) {

    const activity = innerDc.context.activity;

    let commandResponse: Partial<Activity> | string;

    if (isScoreboardRequest(activity)) {
      const scoreBoardRequest = parseScoreboardRequest(activity);
      const results = await getScoreboard(scoreBoardRequest);
      const card = await createCardFromScoreboardResults(innerDc.context, results);
      commandResponse = { attachments: [card] }
    } else if (this.isInfoRequest(innerDc)) {
      commandResponse = getInfo();
    } else if (this.isJokeRequest(innerDc)) {
      commandResponse = getDonutPunsLong();
    } else {
      try {
        const actions = parseScoreActions(activity, true);
        addScores(actions);
        commandResponse = await donutGivenConfirmationMesssage(innerDc.context, actions);
      } catch (e) {
        commandResponse = e;
      }
   }

    await innerDc.context.sendActivity(commandResponse);
    return await innerDc.cancelAllDialogs();
  }
}
