import dotenv from 'dotenv';
/* eslint-disable import/first */
dotenv.config();
import log from 'bog';
import http from 'http';
import BurritoStore from './store/BurritoStore';
import LocalStore from './store/LocalStore';
import database from './database';
import config from './config';
import bot from './bot';
import slack from './slack';
import APIHandler from './api';
import WEBHandler from './web';
import WSSHandler from './wss';

log.level(config.misc.log_level);
log.info('Staring heyburrito');

// Configure BurritoStore
BurritoStore.setDatabase(database);

// Set and start slack services
slack();

// Start bot instance
bot();

// Start localstore instance
LocalStore.start();
/**
 * Httpserver request handler
 */
const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
    /**
     * Check if request url contains api path, then let APIHandler take care of it
     */
    if (request.url.includes(config.http.api_path)) return APIHandler(request, response);
    /**
     * Check if request url contains webpath, then let WEBHandler take care of it
     */
    if (request.url.includes(config.http.web_path)) return WEBHandler(request, response);
    /**
     * redirect all other requests to webPath
     */
    response.writeHead(301, {
        location: config.http.web_path,
    });
    return response.end();
};

/**
 * Start HTTP / WSS server
 */
const httpserver = http.createServer(requestHandler);
httpserver.listen(config.http.http_port, (err) => {
    if (err) throw new Error(`Could not start HTTP server, error => ${err}`);
    // Start WSS instance
    WSSHandler();
    log.info(`HttpServer started on ${config.http.http_port}`);
});
