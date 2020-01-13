import * as log from 'bog';
import config from '../config';
import { pathExists, createPath } from './utils';


export default () => {
    // check if database is file
    if (config.db.db_driver === 'file') {
        log.debug('Database driver is file');

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
};
