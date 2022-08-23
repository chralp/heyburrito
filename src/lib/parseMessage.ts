import { Emojis } from './emojis';

const usernameRegex: RegExp = /(<@[A-Z0-9]{2,}>)/g;

export interface Updates {
  to: string;
  from: string;
  type: string;
  overdrawn?: boolean;
}

export interface Update {
  from?: string;
  updates?: Updates[]
}

/**
 * @param { string } text from slack message
 * @returns array<string>, only unique values
 */
const parseUsernames = (text: string): string[] => {
  // Regex to get all users from message
  const usersRaw = text.match(new RegExp(usernameRegex));
  if (!usersRaw) return [];
  // replace unwanted chars
  const users = usersRaw.map((x) => x.replace('<@', '').replace('>', ''));
  // Remove duplicated values
  const unique: string[] = users.filter((v, i, a) => a.indexOf(v) === i);
  return unique.length ? unique : [];
}

/**
 * @param { Obejct } msg slackmessage
 * @param { array<object> } emojis emojis that we want to use. Comes from env
 * @returns { object } { giver: string, updates:array<object> }
 *  - giver: sent from , ex => giver: USER1
 *  - updates: array<object> containing, username, and type. ex:
 *  - [ { username: 'USER2', type: 'inc' },
 *    { username: 'USER2', type: 'dec' } ] }
 */
const parseMessage = (msg: any, emojis: Emojis[]): Update => {
  // Array containg data of whom to give / remove points from
  const updates = [];

  // Array with "allowed" emojis mentioned in slackmessage
  const emojiHits = [];

  // Get usernames from slack message
  const users: string[] = parseUsernames(msg.text);
  if (!users.length) return {};

  // Match and push allowed emojis to emojiHits
  emojis.map((x: any) => {
    const hitsRaw = msg.text.match(new RegExp(x.emoji, 'g'));
    if (hitsRaw) hitsRaw.forEach((e: any) => emojiHits.push(e));
    return undefined;
  });

  // Rebuild emoji object with emojiHits
  const hits = emojiHits.map((x: any) => (
    {
      emoji: x,
      type: emojis.filter((t: any) => t.emoji === x)[0].type,
    }
  ));

  if (!hits.length) return {};

  // For each emojiHits give each user a update
  hits.map((x) => users.forEach((u) => updates.push({ to: u, from: msg.user, type: x.type })));
  return {
    updates,
    from: msg.user,
  };
}

export { parseMessage, parseUsernames };
