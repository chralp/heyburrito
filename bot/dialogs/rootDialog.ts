import { ComponentDialog, DialogContext } from "botbuilder-dialogs";
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

  async processTeamScoreboardRequest(innerDc: DialogContext, request: ScoreBoardRequest) {
      const members = await getAllMembers(innerDc.context);
      // TODO: iterate over members and all scores with parentContextId==teamId
      console.log(members);
  }

  async processChatScoreboardRequest(innerDc: DialogContext, request: ScoreBoardRequest) {
    const members = await getAllMembers(innerDc.context);
    // TODO: iterate over members and all scores with id==chatId
    console.log(members);
  }

  async processChannelScoreboardRequest(innerDc: DialogContext, request: ScoreBoardRequest) {
    // TODO: channel vs team membership difference? 
    // TODO: iterate over members and all scores with id==channelId
    const members = await getAllMembers(innerDc.context);
    console.log(members);
  }

  async processOrgTreeScoreboardRequest(innerDc: DialogContext, request: ScoreBoardRequest) {
    throw "Not implemented"
  }

  async processGlobalScoreboardRequest(innerDc: DialogContext, request: ScoreBoardRequest) {
    // TODO: get score for user
    throw "Not implemented"
  }

  async processScoreboardRequest(innerDc: DialogContext, request: ScoreBoardRequest) {
    switch (request.context.scope) {
      case "team": return this.processChatScoreboardRequest(innerDc, request);
      case "chat": return this.processTeamScoreboardRequest(innerDc, request);
      case "channel": return this.processChannelScoreboardRequest(innerDc, request);
      case "orgtree": return this.processOrgTreeScoreboardRequest(innerDc, request);
      case "global": return this.processGlobalScoreboardRequest(innerDc, request);
    }
  }

  async triggerCommand(innerDc: DialogContext) {

    const activity = innerDc.context.activity;

    if (isScoreboardRequest(activity)) {
      const scoreBoardRequest = parseScoreboardRequest(activity);
      // await this.processScoreboardRequest(innerDc, scoreBoardRequest);
      const card = await createCardFromScoreboardResults(innerDc.context, {
        request: scoreBoardRequest,
        scores: [
          {score: 3, userId: activity.from.id},
          {score: 2, userId: activity.from.id},
        ]});
      await innerDc.context.sendActivity({ attachments: [card] });
      return await innerDc.cancelAllDialogs();
    }

    try {
      const actions = parseScoreActions(activity, true);
      const response = await donutGivenConfirmationMesssage(innerDc.context, actions);
      await innerDc.context.sendActivity(response);
      return await innerDc.cancelAllDialogs();
    } catch (e) {
      await innerDc.context.sendActivity(e);
      return await innerDc.cancelAllDialogs();
    }
  }
}
