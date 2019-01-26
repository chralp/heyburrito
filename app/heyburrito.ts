import { default as log } from 'bog';
import { default as webserver } from './web';
import path from 'path';
import database from './database';
import BurritoStore from './store/BurritoStore';
import { RTMClient, WebClient } from '@slack/client';
import Bot from './Bot';
import bootstrap from './bootstrap'

import { default as slackUsers } from './lib/getSlackUsers';

import { default as getUserStats } from './lib/handleStats';

//Interfaces
import SlackInterface from './types/Slack.interface'


function heyburrito(config) {
    // Configure BurritoStore
    BurritoStore.setDatabase(database);


    // Local UserStore
    let storedSlackBots: Array<SlackInterface.Stored>;
    let storedSlackUsers: Array<SlackInterface.Stored>;
    let botId: string;

    // Set and start RTM
    const rtm = new RTMClient(config.SLACK_API_TOKEN);
    rtm.start();

    function serverStoredSlackUsers() {
        console.log("stored", JSON.stringify(storedSlackUsers))
        return storedSlackUsers;
    }
    // Fun
    getUserStats(serverStoredSlackUsers);

    const wbc = new WebClient(config.SLACK_API_TOKEN);

    slackUsers(wbc);

    function getBotUsername() {

        storedSlackBots.forEach((x: any) => {
            if (x.name === config.BOT_NAME) {
                botId = x.id;
            }
        });

        if (!botId) {
            log.warn('Botname set in config, but could not match user on slack');
        }
    }

    function botUserID() {
        return botId;
    }

    function getAllBots() {
        return storedSlackBots;
    }

    async function localStore() {
        const res = await slackUsers(wbc);
        console.log('res', res);
        storedSlackUsers = null;
        storedSlackBots = null;
        storedSlackUsers = res.users;
        storedSlackBots = res.bots;
        console.log("StoredBot", storedSlackBots)
        return getBotUsername();
    }

    // Run on boot
    localStore();
    const BotInstance = new Bot(rtm, botUserID, getUserStats, getAllBots);
    BotInstance.listener();

    // Run every hour
    setInterval(localStore, 60 * 60 * 1000);

    // Start webserver
    webserver(
        config.THEME,
        serverStoredSlackUsers,
    );
}

export default heyburrito;
