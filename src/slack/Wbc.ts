import * as log from 'bog';
import config from '../config';

interface WbcParsed {
  id: string;
  name: string;
  avatar: string;
  memberType: string;
}

class Wbc {
  wbc: any;

  register(wbc: any) {
    this.wbc = wbc;
  }

  async fetchSlackUsers() {
    const users: WbcParsed[] = [];
    const bots: WbcParsed[] = [];

    log.info('Fetching slack users via wbc');
    const result = await this.wbc.users.list();
    result.members.forEach((x: any) => {
      // reassign correct array to arr
      const arr = x.is_bot ? bots : users;
      arr.push({
        id: x.id,
        name: x.is_bot ? x.name : x.real_name,
        memberType: x.is_restricted ? 'guest' : 'member',
        avatar: x.profile.image_48,
      });
    });
    return { users, bots };
  }

  async sendDM(username: string, text: string) {
    const openConversation = await this.wbc.conversations.open({
      users: username,
    });

    if (!openConversation.ok) {
      log.warn(`Failed to open conversation with ${username}`);
      return;
    }

    const res = await this.wbc.chat.postMessage({
      text: text,
      channel: openConversation.channel.id,
      username: config.slack.bot_name,
      icon_emoji: ':duck:',
    });

    if (res.ok) {
      log.info(`Notified user ${username}`);
    }
  }

  async sendDMBlock(username: string, text: string, blocks: Object[]) {
    const openConversation = await this.wbc.conversations.open({
      users: username,
    });

    if (!openConversation.ok) {
      log.warn(`Failed to open conversation with ${username}`);
      return;
    }

    const res = await this.wbc.chat.postMessage({
      text: text,
      blocks: blocks,
      channel: openConversation.channel.id,
      username: config.slack.bot_name,
      icon_emoji: ':duck:',
    });

    if (res.ok) {
      log.info(`Notified user ${username}`);
    }
  }

  async fetchReactedMessage(channelId: string, ts: number) {
    log.info('Fetching reacted message via wbc');

    const res = await this.wbc.conversations.replies({
      channel: channelId,
      ts: ts,
      latest: ts,
      inclusive: true,
      limit: 1,
    });

    log.info(res.messages[0])

    return res.messages[0];
  }
}

export default new Wbc();
