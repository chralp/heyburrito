import { ActionTypes, CardFactory, TurnContext, TextFormatTypes } from "botbuilder";
import { ComponentDialog, DialogContext } from "botbuilder-dialogs";
import { isScoreboardRequest, parseNewScores, parseScoreboardRequest } from "./parser/messageParser";

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
      await innerDc.context.sendActivity(JSON.stringify(scoreBoardRequest));
      return await innerDc.cancelAllDialogs();
    }

    try {
      const scoresFromTheMessage = parseNewScores(activity, true);
      await innerDc.context.sendActivity(JSON.stringify(scoresFromTheMessage));
      return await innerDc.cancelAllDialogs();
    } catch (e) {
      await innerDc.context.sendActivity(e);
      return await innerDc.cancelAllDialogs();
    }
    
    // switch (text) {
    //   case "show": {
    //     // if (innerDc.context.activity.conversation.isGroup) {
    //     //   await innerDc.context.sendActivity(
    //     //     `Sorry, currently TeamsFX SDK doesn't support Group/Team/Meeting Bot SSO. To try this command please install this app as Personal Bot and send "show".`
    //     //   );
    //     //   return await innerDc.cancelAllDialogs();
    //     // }
    //     break;
    //   }
    //   case "intro": {
    //     // const cardButtons = [
    //     //   {
    //     //     type: ActionTypes.ImBack,
    //     //     title: "Show profile",
    //     //     value: "show",
    //     //   },
    //     // ];
    //     // const card = CardFactory.heroCard("Introduction", null, cardButtons, {
    //     //   text: `This Bot has implemented single sign-on (SSO) using the identity of the user signed into the Teams client. See the <a href="https://aka.ms/teamsfx-docs-auth">TeamsFx authentication document</a> and code in <pre>bot/dialogs/mainDialog.js</pre> to learn more about SSO.<br>Type <strong>show</strong> or click the button below to show your profile by calling Microsoft Graph API with SSO. To learn more about building Bot using Microsoft Teams Framework, please refer to the <a href="https://aka.ms/teamsfx-docs">TeamsFx documentation</a>.`,
    //     // });

    //     // await innerDc.context.sendActivity({ attachments: [card] });
    //     // return await innerDc.cancelAllDialogs();
    //   }
    //   default: {
    //     const card = CardFactory.heroCard("", null, [], {
    //       text: `This is a donut bot. Try sending @mention to someone to give them a donut!`,
    //     });
    //     await innerDc.context.sendActivity({ attachments: [card] });
    //     return await innerDc.cancelAllDialogs();
    //   }
    // }
  }
}
