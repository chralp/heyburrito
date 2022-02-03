import { handleInteraction } from '../src/bot/interaction';
describe('bot', () => {

  describe('handleInteraction', () => {
    it('should match help and return list of commands to user / channel', async () => {
      const message = {
        text: "<bot> help"
      };
      const res = await handleInteraction(message);
      console.log("IN TEST", res);
    });

  });

});
