import LocalStore from './store/LocalStore';
import { parseMessage } from './lib/parseMessage';
import { handleBurritos } from './handleBurritos';
import { validBotMention, validMessage } from './lib/validator';
import { emojis } from './lib/emojis';
import Rtm from './slack/Rtm';
import Wbc from './slack/Wbc';


export const notifyUser = (user: string, message: string) => Wbc.sendDM(user, message);

export const start = () => Rtm.on('slackMessage', (event: any) => incomingMessage(event));

export const incomingMessage = async (message) => {

  // If message not valid then dont process it
  if (!validMessage(message, emojis, LocalStore.getAllBots())) return false;

  // If botMention handle message seperate later on. No support today
  if (validBotMention(message, LocalStore.botUserID())) {
    return await handleBotInteraction(message);
  }

  const result = parseMessage(message, emojis);
  if (result?.updates) {
    const { from, updates } = result;
    await handleBurritos(from, updates);
  }
};


const BOT_INTERACTIONS = [
  'help',
  'stats',
  'emojis'
];

const handleBotInteraction = async(message) => {

  console.log(message)
  const hits = BOT_INTERACTIONS.map((arg) => {
    if(message.text.includes(arg)) return arg;
  }).filter(s => s);
  console.log(hits);
};
