import config from '../config';
const {
  emojiInc,
  emojiDec,
  disableEmojiDec,
} = config.slack;

export interface Emojis {
  type: string;
  emoji: string;
}

export const emojis: Emojis[] = [];

const incEmojis = emojiInc.split(',').map((emoji: string) => emoji.trim());
incEmojis.forEach((emoji: string) => emojis.push({ type: 'inc', emoji }));

if (!disableEmojiDec) {
  const decEmojis = emojiDec.split(',').map((emoji: string) => emoji.trim());
  decEmojis.forEach((emoji: string) => emojis.push({ type: 'dec', emoji }));
}
