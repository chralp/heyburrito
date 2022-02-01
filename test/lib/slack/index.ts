import slack from '../../../src/slack';
import WBCHandler from '../../../src/slack/Wbc';
import Localstore from '../../../src/store/LocalStore';

export const initSlack = async () => {
  // Set and start slack services
  const { wbc } = slack;

  WBCHandler.register(wbc);
  await Localstore.fetch();
  await Localstore.getSlackUsers();
}
