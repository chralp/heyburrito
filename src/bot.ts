import LocalStore from './store/LocalStore';
import { parseMessage } from './lib/parseMessage';
import { handleBurritos } from './handleBurritos';
import { validBotMention, validMessage } from './lib/validator';
import { emojis } from './lib/emojis';
import Rtm from './slack/Rtm';
import Wbc from './slack/Wbc';

export const notifyUser = (user: string, message: string) => Wbc.sendDM(user, message);

export const incomingMessage = async (message) => {

  // If message not valid then dont process it
  if (!validMessage(message, emojis, LocalStore.getAllBots())) return false;

  // If botMention handle message seperate later on. No support today
  if (validBotMention(message, LocalStore.botUserID())) return false;

  const result = parseMessage(message, emojis);
  if (result?.updates) {
    const { giver, updates } = result;
    await handleBurritos(giver, updates);
  }
};

export const start = () => Rtm.on('slackMessage', (event: any) => incomingMessage(event));
