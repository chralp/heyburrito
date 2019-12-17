
import EmojiInterface from '../types/Emoji.interface';
const usernameRegex: RegExp = /(\<\@[A-Z0-9]{2,}\>)/g;

/**
 * @param { string } text from slack message
 * @returns array<string>, only unique values
 */
function parseUsernames(text: string) {

    // Regex to get all users from message
    const usersRaw = text.match(new RegExp(usernameRegex));
    if (!usersRaw) return

    // replace unwanted chars
    const users = usersRaw.map(x => x.replace('<@', '').replace('>', ''));

    // Remove duplicated values
    const unique: Array<string> = users.filter((v, i, a) => a.indexOf(v) === i);
    return unique;
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
function parseMessage(msg, emojis: Array<EmojiInterface>) {

    // Array containg data of whom to give / remove points from
    const updates = []

    // Array with "allowed" emojis mentioned in slackmessage
    const emojiHits = []

    // Get usernames from slack message
    const users = parseUsernames(msg.text)
    if (!users) return false

    // Match and push allowed emojis to emojiHits
    emojis.map(x => {
        const hitsRaw = msg.text.match(new RegExp(x.emoji, 'g'))
        if (hitsRaw) hitsRaw.forEach(x => emojiHits.push(x))
    })

    // Rebuild emoji object with emojiHits
    const hits = emojiHits.map(x => ({ emoji: x, type: emojis.filter(t => t.emoji == x)[0].type }))

    if (hits.length === 0) return false;

    // For each emojiHits give each user a update
    hits.map(x => users.forEach(u => updates.push({ username: u, type: x.type })))

    return {
        giver: msg.user,
        updates,
    };
};

export { parseMessage, parseUsernames }
