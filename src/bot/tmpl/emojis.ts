import { emojis } from '../../lib/emojis';

const inc = emojis.map(emoji => {
  if (emoji.type === 'inc') return emoji.emoji
}).filter(y => y);

const incTxt = inc.map((emoji) => {
  return `${emoji} `;
}).filter(y => y).join().replace(/,/g, '')

const dec = emojis.map(emoji => {
  if (emoji.type === 'dec') return emoji.emoji
}).filter(y => y);


const decTxt = dec.map((emoji) => {
  return `${emoji} `;
}).filter(y => y).join().replace(/,/g, '')

export const tmplEmoji = () => {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: "Available emojis"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: `*+  * ${incTxt}`
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: `*-  * ${decTxt}`
        }
      }
    ]
  }
};
