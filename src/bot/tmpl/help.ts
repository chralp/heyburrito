import { BOT_INTERACTIONS } from '../interaction';
export const tmplHelp = () => {
  return {
    blocks: [
      {
        type: "section",
        fields: BOT_INTERACTIONS.map((command) => {
          if (command !== 'help') {
            return {
              type: 'plain_text',
              text: `*${command}* \n`
            }
          }
        }).filter(y => y)
      }
    ]
  }
};
