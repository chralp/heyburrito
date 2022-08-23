import log from 'loglevel';
import config from '../config';

interface WbcParsed {
  id: string;
  name: string;
  avatar: string;
  memberType: string;
}

export interface SendDM {
  user?: string;
  channel?: string;
  blocks?: any;
  text?: string;
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

  async sendDM(args: SendDM) {
    const user = args.user ? args.user : args.channel;
    const res = await this.wbc.chat.postMessage({
      ...args,
      username: config.slack.bot_name || 'heyburrito',
      icon_emoji: config.slack.bot_emoji || ':burre:',
    });
    if (res.ok) {
      log.info(`Notified user ${user}`);
    } else {
      log.info(`Could not notify ${user}`);
    }
    return res;
  }
}

export default new Wbc();
