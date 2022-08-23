import { initDatabase, seedDatabase } from './init-database-driver';

async function init({ driver }) {

  const { database, ...rest } = await initDatabase({ driver });
  await seedDatabase(database);
  return {
    ...rest
  };
}
export {
  init,
}
