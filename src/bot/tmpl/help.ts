import { commands } from '../commands'

export const tmplHelp = () => {
  const botTxt = commands.map(({ cmd, info, subCmd }) => {
    if (!subCmd) return `*${cmd}* - ${info}`;

    let txt = `*${cmd}* - ${info}`;
    subCmd.map(({ cmd, info }) => {
      txt += `\n   - *${cmd}* - ${info}`
    });

    return txt;

  }).filter(y => y).join().replace(/,/g, "\n");

  return {
    blocks: [
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: "Available commands:"
        }
      },
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: "@heyburrito <command> <sub command?>"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: botTxt
        }
      }
    ]
  }
};
