import SlackMessageInterface from '../types/SlackMessage.interface';

function validMessage(message:SlackMessageInterface, emojis, allBots:Function) {

    // Message is changed, not valid!
    if ((!!message.subtype) && (message.subtype === 'message_changed')) {
        return false;
    }
    // Message is changed, not valid!
    if ((!!message.subtype) && (message.subtype === 'message_deleted')) {
        return false;
    }
    if ((!!message.subtype) && (message.subtype === 'bot_message')) {
        return false;
    }
    // if (message.text.match(`<@${message.user}>`)) {
    //    return false;
    // }

    const bots = allBots();

    for (const x of bots) {
        // Message is sent from bot
        if (message.user.match(`${x.id}`)) {
            return false;
        }

        // Message contains bot and emoji
        if (message.text.match(`${x.id}`)) {
            for (const e of emojis) {
                if (message.text.match(`${e.emoji}`)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function validBotMention(message:SlackMessageInterface, botUserID:Function) {
    const botid = botUserID();

    if ((message.text.match(`<@${botid}>`)) && (message.text.match('stats'))) {
        return true;
    }
    return false;
}

export { validBotMention, validMessage };
