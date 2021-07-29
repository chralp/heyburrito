import { ComponentDialog, DialogContext } from "botbuilder-dialogs";
import { addScores, getScoreboard } from "../data/donutrepository";
import { ScoreBoardRequest } from "../models/score";
import { createCardFromScoreboardResults, donutGivenConfirmationMesssage } from "./messageComposer/composer";
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

  async triggerCommand(innerDc: DialogContext) {

    const activity = innerDc.context.activity;

    if (isScoreboardRequest(activity)) {
      const scoreBoardRequest = parseScoreboardRequest(activity);
      const results = await getScoreboard(scoreBoardRequest);
      const card = await createCardFromScoreboardResults(innerDc.context, results);
      await innerDc.context.sendActivity({ attachments: [card] });
      return await innerDc.cancelAllDialogs();
    }

    try {
      const actions = parseScoreActions(activity, true);
      addScores(actions);
      const response = await donutGivenConfirmationMesssage(innerDc.context, actions);
      await innerDc.context.sendActivity(response);
      return await innerDc.cancelAllDialogs();
    } catch (e) {
      await innerDc.context.sendActivity(e);
      return await innerDc.cancelAllDialogs();
    }
  }
}
