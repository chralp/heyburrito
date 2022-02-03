import LocalStore from '../store/LocalStore';
import { parseMessage } from '../lib/parseMessage';
import { handleBurritos } from '../handleBurritos';
import { handleInteraction } from './interaction';
import { validBotMention, validMessage } from '../lib/validator';
import { emojis } from '../lib/emojis';
import Rtm from '../slack/Rtm';


/**
 * Start listen to slack messages / events */
export const start = () => Rtm.on('slackMessage', (event: any) => incomingMessage(event));



export const incomingMessage = async (message) => {

  // If message not valid then dont process it
  if (!validMessage(message, emojis, LocalStore.getAllBots())) return false;

  // If botMention handle message seperate later on. No support today
  if (validBotMention(message, LocalStore.botUserID())) {
    return await handleInteraction(message);
  }

  const result = parseMessage(message, emojis);
  if (result?.updates) {
    const { from, updates } = result;
    await handleBurritos(from, updates);
  }
};
