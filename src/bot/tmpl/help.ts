import { BOT_INTERACTIONS } from '../interaction';

export const tmplHelp = () => {
  const botTxt = BOT_INTERACTIONS.map((command) => {
    return `*${command}*`;
  }).filter(y => y).join().replace(/,/g, "\n");

  return {
    blocks: [
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: "Available commands"
        }
      },
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: "@heyburrito <command>"
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
