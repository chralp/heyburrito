import log from 'loglevel';
import { parseUsernames } from './parseMessage';

function selfMention(message: any) {
  const selfmention = message.text.match(`<@${message.user}>`);
  if (selfmention) {
    log.warn('Not valid, sender mentioned in message');
  }
  return !!selfmention;
}

function sentFromBot(message: any, allBots: any) {
  const fromBot = allBots.filter((x: any) => message.user.match(x.id));
  return !!fromBot.length;
}

function sentToBot(message: any, allBots: any) {
  // Get all users from message.text
  const usersArr = parseUsernames(message.text);

  if (!usersArr) return false;

  const toBot = allBots.filter((v: any) => {
    if (usersArr.includes(v.id)) return v;
    return undefined;
  });

  return !!toBot.length;
}

function burritoToBot(message: any, emojis: any) {
  const burritoSentToBot = emojis.filter((x: any) => message.text.match(`${x.id}`));
  return !!burritoSentToBot.length;
}

function validMessage(message: any, emojis: any, allBots: any): boolean {
  // We dont want messages with subtypes
  if (message.subtype) return false;

  // Check if sender is mentioned in message
  if (selfMention(message)) return false;

  // Check if message.user is registerd Bot
  const usrIsBot = allBots.filter((m: any) => {
    if (message.user.match(`${m.id}`)) return m;
    return undefined;
  });
  if (usrIsBot.length) return false;

  // Check if message.text contains registerd Bot
  const txtContainsBot = allBots.filter((m: any) => {
    if (message.text.match(`${m.id}`)) return m;
    return undefined;
  });

  if (txtContainsBot.length) {
    // Check if message.text contains registerd emoji to bot
    const txtContainsEmoji = emojis.filter((e) => {
      if (message.text.match(`${e.emoji}`)) return e;
      return undefined;
    });
    if (txtContainsEmoji.length) return false;
  }
  return true;
}

function validBotMention(message: any, botUserID: any) {
  if ((message.text.match(`<@${botUserID}>`)) && (message.text.match('stats'))) {
    return true;
  }
  return false;
}

export {
  validBotMention,
  validMessage,
  selfMention,
  sentFromBot,
  sentToBot,
  burritoToBot,
};
