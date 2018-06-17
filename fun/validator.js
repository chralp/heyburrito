const log = require('bog');

module.exports = ((msg, emojis) => {
    const hitsCount = 0;
    const hits = [];
    const users = [];
    const updates = [];
    const regex = /(\<\@[A-Z0-9]{2,}\>)/g;

    /*
        1. Check so message is not an updated post ( done )
        2. Check so sender isnt mention in text ( done )
        3. Get users from text ( done )
        4. Count emoji hits ( done )
        5. Create object for each emojihit to each user ( done )
    */

    // Message is changed, not valid!
    if ((!!msg.subtype) && (msg.subtype === 'message_changed')) {
        return false;
    }
    if ((!!msg.subtype) && (msg.subtype === 'message_deleted')) {
        return false;
    }

    if (msg.text.match(`<@${msg.user}>`)) {
        log.warn('User that sent message is also mentions in message, not valid');
        return false;
    }

    // Regex to get all users from message
    const usersRaw = msg.text.match(new RegExp(regex));

    // remove <@ and >
    if (usersRaw) {
        for (const u of usersRaw) {
            const username = u.replace('<@', '').replace('>', '');

            // Check if username already exists in array

            if (!users.includes(username)) {
                users.push(username);
            }
        }
    } else {
        return false;
    }

    // Count hits
    emojis.map((x) => {
        const hit = msg.text.match(x.emoji);
        if (hit) {
            emojihit = msg.text.match(new RegExp(x.emoji, 'g'));
            for (const e of emojihit) {
                const obj = {
                    emoji: x.emoji,
                    type: x.type,
                };
                hits.push(obj);
            }
        }
    });
    if (hits.length === 0) {
        return false;
    }

    // Create object for each user for each emoji hit

    for (const i of hits) {
        for (const u of users) {
            const obj = {
                username: u,
                type: i.type,
            };
            updates.push(obj);
        }
    }

    return {
        giver: msg.user,
        updates,
    };
});
