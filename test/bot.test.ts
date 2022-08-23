import { initSlack } from './lib/slack';
import { handleInteraction } from '../src/bot/interaction';
import * as config from '../src/config';

initSlack()
describe('bot', () => {
  describe('handleInteraction', () => {
    it('should match help and return list of commands to user / channel', async () => {
      config.default.slack = { slackMock: true }
      const message = {
        text: "USER1 help",
        user: "USER1",
        channel: "<channel>"
      };
      const res = await handleInteraction(message);
      expect(res).toEqual({"user":"USER1","channel":"<channel>","blocks":[{"type":"section","text":{"type":"mrkdwn","text":"Available commands:"}},{"type":"section","text":{"type":"mrkdwn","text":"@heyburrito <command> <sub command?>"}},{"type":"divider"},{"type":"section","text":{"type":"mrkdwn","text":"*help* - Show all available commands\n*emojis* - Show all available emojis\n*top5* - Show top5 list today <defaults to>\n   - *to* - Return list of top5 receiver\n   - *from* - Return list of top5 sender"}}],"text":" ","username":"heyburrito","icon_emoji":":burre:"})
    });
  });
});
