import Wbc from '../slack/Wbc';
import { tmplHelp } from './tmpl/help';
import { tmplEmoji } from './tmpl/emojis';

export const BOT_INTERACTIONS = [
  'help',
  'emojis'
];

const parseCommands = (text) => {
  return BOT_INTERACTIONS.map((arg) => {
    if (text.includes(arg)) return arg;
  }).filter(s => s);
};

/**
 * Send message back to user or channel */
export const notifyUser = (user: string, message: any) => Wbc.sendDM(user, message);

export const handleInteraction = async (message) => {

  const res = parseCommands(message.text);
  if (!res.length) return false;

  res.forEach((command) => {
    switch (command) {
      case 'help': {
        const data = tmplHelp();
        return notifyUser(message.username, data)
      }
      case 'emojis': {
        const data = tmplEmoji();
        return notifyUser(message.username, data)
      }
      default: {
        return false;
      }
    }
  });
};
