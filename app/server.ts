import dotenv from 'dotenv';
dotenv.config();
import log from 'bog';
import http from 'http';
import { RTMClient, WebClient } from '@slack/client';
import bootstrap from './boot';
import BurritoStore from './store/BurritoStore';
import LocalStore from './store/LocalStore';
import database from './database';
import config from './config';
import Bot from './Bot';

bootstrap();

// HTTP handlers
import APIHandler from './api';
import WEBHandler from './web';
import WSSHandler from './wss';

log.info("Staring heyburrito");

// Configure BurritoStore
BurritoStore.setDatabase(database);

// Set and start RTM
const rtm = new RTMClient(config('SLACK_API_TOKEN'));
rtm.start();

// Set up webClient and fetch slackUsers
const wbc = new WebClient(config('SLACK_API_TOKEN'));


// Initialize new LocalStore
LocalStore.start(wbc);

// Start bot instance
const BotInstance = new Bot(rtm, wbc);
BotInstance.listener();

/**
 * Httpserver request handler
 */
const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {

    /**
     * Check if request url contains api path, then let APIHandler take care of it
     */
    if (request.url.includes(config('API_PATH', true))) return APIHandler(request, response);

    /**
     * Check if request url contains webpath, then let WEBHandler take care of it
     */
    if (request.url.includes(config('WEB_PATH', true))) return WEBHandler(request, response);

    /**
     * redirect all other requests to webPath
     */
    response.writeHead(301, {
        location: config('WEB_PATH')
    });
    response.end();

};

/**
 * Start HTTP / WSS server
 */
const httpserver = http.createServer(requestHandler);
httpserver.listen(config('HTTP_PORT', true), (err) => {
    if (err) throw new Error(`Could not start HTTP server, error => ${err}`)

    WSSHandler();
    log.info(`HttpServer started on ${config('HTTP_PORT', true)}`);
});
