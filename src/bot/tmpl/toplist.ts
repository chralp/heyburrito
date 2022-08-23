import { getScoreBoard } from '../../middleware';

interface TopList {
  listType: string;
  amount: number;
}

export const tmplToplist = async ({ listType, amount }: TopList) => {
  const result = await getScoreBoard(listType, 'inc', true);

  const topList = result.slice(0, amount)

  const topListTxt = topList.map(({ name, score }) => {
    return `*${score}* - ${name}`;
  }).filter(y => y).join().replace(/,/g, "\n");
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: 'mrkdwn',
          text: `${topListTxt}`
        }
      }
    ]
  }
};
