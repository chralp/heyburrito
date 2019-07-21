import dotenv from 'dotenv';
dotenv.config();
import config from './lib/config';
import { default as log } from 'bog';
import { RTMClient, WebClient } from '@slack/client';
import Bot from './Bot';
import webserver from './web';
import database from './database';
import BurritoStore from './store/BurritoStore';
import LocalStore from './store/LocalStore';

log.info("Staring heyburrito");

// Configure BurritoStore
BurritoStore.setDatabase(database);

// Set and start RTM
const rtm = new RTMClient(config("SLACK_API_TOKEN"));
rtm.start();

// Set up webClient and fetch slackUsers
const wbc = new WebClient(config("SLACK_API_TOKEN"));

// Initialize new LocalStore
LocalStore.start(wbc);

// Start bot instance
const BotInstance = new Bot(rtm, wbc);
BotInstance.listener();

// Start webserver
webserver(config("THEME"));
