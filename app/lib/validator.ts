import { default as log } from 'bog'
import { parseUsernames } from './parseMessage'
import SlackMessageInterface from '../types/SlackMessage.interface';

function selfMention(message) {
    const selfMention = message.text.match(`<@${message.user}>`) ? true : false
    if (selfMention) log.warn('Not valid, sender mentioned in message')
    return selfMention;
}

function sentFromBot(message, allBots) {

    const sentFromBot = allBots.filter(x => message.user.match(x.id))
    return !!sentFromBot.length

}

function sentToBot(message, allBots) {

    // Get all users from message.text
    const usersArr = parseUsernames(message.text)
    if (!usersArr) return false

    const sentToBot = allBots.filter((v) => {
        usersArr.includes(v.id)
    })
    //a.indexOf(v) === i);
    return !!sentToBot.length
}

function burritoToBot(message, emojis) {
    /*
        for (const x of bots) {
            // Message is sent from bot
            if (message.user.match(`${x.id}`)) return false;

            // Message contains bot and emoji
            if (message.text.match(`${x.id}`)) {
                for (const e of emojis) {
                    if (message.text.match(`${e.emoji}`)) {
                        return false;
                    }
                }
            }
        }
    */

    const burritoToBot = emojis.filter(x => message.text.match(`${x.id}`))
    return !!burritoToBot.length
}


function validMessage(message: SlackMessageInterface, emojis, allBots) {

    // We dont want messages with subtypes
    if (message.subtype) return false

    // Check if sender is mentioned in message
    if (selfMention(message)) return false

    for (const x of allBots) {
        // Message is sent from bot
        if (message.user.match(`${x.id}`)) return false;

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


function validBotMention(message: SlackMessageInterface, botUserID) {
    if ((message.text.match(`<@${botUserID}>`)) && (message.text.match('stats'))) {
        return true;
    }
    return false;
}

export { validBotMention, validMessage, selfMention, sentFromBot, sentToBot, burritoToBot };
