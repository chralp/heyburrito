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
export const notifyUser = async (args: SendDM) => Wbc.sendDM(args);

export const handleInteraction = async ({ user, channel, text }) => {
  const res = parseCommands(text);

  if (!res.length) {
    const { blocks } = tmplHelp();
    return notifyUser({ user, channel, blocks, text: ' ' })
  }

  return res.reduce(async (prev: any, cmd: string) => {
    return prev.then(async () => {
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
          console.log("Blocks", blocks)
          if(!(blocks[0]?.text?.text.length < 0)) return false;
          return notifyUser({ user, channel, blocks, text: ' ' });
        }
        default: {
          const { blocks } = tmplHelp();
          return await notifyUser({ user, channel, blocks, text: ' ' });
        }
      }
    });
  }, Promise.resolve());
};
