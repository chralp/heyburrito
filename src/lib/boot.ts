import log from 'loglevel';
import config from '../config';
import { pathExists, createPath } from './utils/path';
import themeHandler from './themeHandler';

export default async () => {
  log.setLevel(config.misc.log_level);
  log.debug('Loaded ENVs for boot:');
  log.debug('=====================');
  log.debug('db_driver:', config.db.db_driver);
  log.debug('themeName', config.theme.themeName);

  if (config.theme.path) {
    log.debug('themePath:', config.theme.themePath);
  } else {
    log.debug('themeUrl:', config.theme.url);
  }
  log.debug('=====================');
  await themeHandler();
  // check if database is file
  if (config.db.db_driver === 'file') {
    log.info('Database driver is file');

    // Check if path exists
    if (!pathExists(config.db.db_path)) {
      log.debug('Database path does not exists');

      // Create path
      if (createPath(config.db.db_path)) {
        log.debug('Database path created', config.db.db_path);
      } else {
        // Better error handle here, try to recreate to some default folder ?
        throw new Error('Could not create database path');
      }
    }
  }
  return true;
};
