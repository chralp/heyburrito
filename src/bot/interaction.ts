import Wbc from '../slack/Wbc';
import { tmplHelp } from './tmpl/help';
import { tmplEmoji } from './tmpl/emojis';
import { tmplToplist } from './tmpl/toplist';
import { commands } from './commands';
import { SendDM } from '../slack/Wbc';

const parseCommands = (text) => {
  return commands.map(({ cmd }) => {
    if (text.includes(cmd)) return cmd;
  }).filter(s => s);
};

/**
 * Send message back to user or channel */
export const notifyUser = (args: SendDM) => Wbc.sendDM(args);

export const handleInteraction = ({ user, channel, text }) => {

  const res = parseCommands(text);

  if (!res.length) {
    const { blocks } = tmplHelp();
    return notifyUser({ user, channel, blocks, text: ' ' })
  }

  res.forEach(async (cmd) => {
    switch (cmd) {
      case 'help': {
        const { blocks } = tmplHelp();
        return notifyUser({ user, channel, blocks, text: ' ' });
      }
      case 'emojis': {
        const { blocks } = tmplEmoji();
        return notifyUser({ user, channel, blocks, text: ' ' });
      }
      case 'top5': {
        const { blocks } = await tmplToplist({ listType: 'to', amount: 5 })
        return notifyUser({ user, channel, blocks, text: ' ' });
      }
      default: {
        const { blocks } = tmplHelp();
        return notifyUser({ user, channel, blocks, text: ' ' });
      }
    }
  });
};
