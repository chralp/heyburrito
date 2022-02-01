import * as dotenv from 'dotenv';
dotenv.config();
import { initDatabase, seedDatabase } from './init-database-driver';
import Localstore from '../../../src/store/LocalStore';
import WBCHandler from '../../../src/slack/Wbc';
import slack from '../../../src/slack';


// await give(toUser, fromUser, pickRandomDate(oneWeek, today));

async function init({ driver }) {

  // Set and start slack services
  const { wbc } = slack;

  let SLACKUSERS = []

  await WBCHandler.register(wbc);
  await Localstore.fetch();
  const users = await Localstore.getSlackUsers();
  SLACKUSERS = users.map(x => x.id)


  const { database, ...rest } = await initDatabase({ driver });
  await seedDatabase(database);
  return {
    ...rest
  };
}
export {
  init,
}
