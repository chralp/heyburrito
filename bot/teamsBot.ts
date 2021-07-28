import { TeamsActivityHandler, CardFactory, TurnContext, SigninStateVerificationQuery, ActionTypes, BotState} from "botbuilder";
import { MainDialog } from "./dialogs/mainDialog";
import BurritoStore from "../src/store/BurritoStore";

export class TeamsBot extends TeamsActivityHandler {
  conversationState: BotState;
  userState: BotState;
  dialog: MainDialog;
  dialogState: any;

  /**
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {Dialog} dialog
   */
  constructor(conversationState: BotState, userState: BotState, dialog: MainDialog) {
    super();
    if (!conversationState) {
      throw new Error("[TeamsBot]: Missing parameter. conversationState is required");
    }
    if (!userState) {
      throw new Error("[TeamsBot]: Missing parameter. userState is required");
    }
    if (!dialog) {
      throw new Error("[TeamsBot]: Missing parameter. dialog is required");
    }
    this.conversationState = conversationState;
    this.userState = userState;
    this.dialog = dialog;
    this.dialogState = this.conversationState.createProperty("DialogState");

    this.onMessage(async (context, next) => {
      console.log("Running dialog with Message Activity.");

      // TODO: Make this real
      // TODO: Fix error: MongoWriteConcernError: No write concern mode named 'majority/heyburrito' found in replica set configuration
      await BurritoStore.giveBurrito('foo', 'bar');

      // Run the Dialog with the new message Activity.
      await this.dialog.run(context, this.dialogState);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }

  async run(context: TurnContext) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }

  async handleTeamsSigninVerifyState(context: TurnContext, query: SigninStateVerificationQuery) {
    console.log("Running dialog with signin/verifystate from an Invoke Activity.");
    await this.dialog.run(context, this.dialogState);
  }

  async handleTeamsSigninTokenExchange(context: TurnContext, query: SigninStateVerificationQuery) {
    await this.dialog.run(context, this.dialogState);
  }

  async onSignInInvoke(context: TurnContext) {
    await this.dialog.run(context, this.dialogState);
  }

}

