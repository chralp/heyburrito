import * as log from 'bog';
import { EventEmitter } from 'events';

interface SlackItem {
  type: string;
  channel?: string;
  ts?: string;
}

interface SlackEvent {
  type: string;
  user: string;
  text?: string;
  reaction?: string;
  item_user?: string;
  client_msg_id?: string;
  suppress_notification?: boolean;
  team?: string;
  channel?: string;
  event_ts?: string;
  ts?: string;
  subtype?: string;
  item?: SlackItem;
}

class Rtm extends EventEmitter {
  rtm: any;

  register(rtm: any) {
    this.rtm = rtm;
    this.listener();
  }

  listener(): void {
    log.info('Listening on slack messages and reactions');
    this.rtm.on('message', (event: SlackEvent) => {
      if (!!event.subtype && event.subtype === 'channel_join') {
        log.info('Joined channel', event.channel);
      }
      if (event.type === 'message') {
        this.emit('slackMessage', event);
      }
    });
    this.rtm.on('reaction_added', (event: SlackEvent) => {
      if (event.type === 'reaction_added') {
        this.emit('slackReaction', event);
      }
    });
  }
}

export default new Rtm();
