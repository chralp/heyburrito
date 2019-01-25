import { default as log } from 'bog'
import { parseUsernames } from './parseMessage'
import SlackMessageInterface from '../types/SlackMessage.interface';

/*
  if ((!!event.subtype) && (event.subtype === 'channel_join')) {
      log.info('Joined channel', event.channel);
  }

        if (event.type === 'message') {

            if (validMessage(event, emojis, this.allBots)) {
                if (validBotMention(event, this.botUserID)) {
                    // Geather data and send back to user
                    this.getUserStats(event.user).then((res) => {
                        this.sendToUser(event.user, res);
                    });
                } else {
                    const result = parseMessage(event, emojis);
                    console.log('result', result);
                    if (result) {
                        storeminator(result);
                    }
                }
            }
        }
*/

function selfMention(message) {
    const selfMention = message.text.match(`<@${message.user}>`) ? true : false
    if (selfMention) log.warn('Not valid, sender mentioned in message')
    return selfMention;
}

function sentFromBot(message, allBots) {

    const bots = allBots();
    const sentFromBot = bots.filter(x => message.user.match(x.id))
    return !!sentFromBot.length

}


function sentToBot(message, allBots) {
    const bots = allBots();
    console.log("message", message)

    // Get all users from message.text
    const usersArr = parseUsernames(message.text)
    if (!usersArr) return false

    const sentToBot = bots.filter((v) => {
        usersArr.includes(v.id)
    })
    //a.indexOf(v) === i);
    console.log("sentToBot", sentToBot)
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


function validMessage(message: SlackMessageInterface, emojis, allBots: Function) {


    // Check if sender is mentioned in message
    if (selfMention(message)) return false

    // We dont want messages with subtypes
    if (message.subtype) return false



    const bots = allBots();


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

    return true;
}


function validBotMention(message: SlackMessageInterface, botUserID: Function) {
    const botid = botUserID();

    if ((message.text.match(`<@${botid}>`)) && (message.text.match('stats'))) {
        return true;
    }
    return false;
}

export { validBotMention, validMessage, selfMention, sentFromBot, sentToBot, burritoToBot };
