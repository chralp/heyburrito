import * as log from 'bog';
import config from '../config';
import { pathExists, createPath } from './utils';
import themeHandler from './themeHandler';

export default async () => {


    log.debug('Loaded ENVs for boot:');
    log.debug('=====================');
    log.debug('db_driver:', config.db.db_driver);
    log.debug('theme:', config.theme.themePath);
    log.debug('=====================');

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


    await themeHandler();
    return true;
};
