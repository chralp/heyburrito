import dotenv from 'dotenv';
dotenv.config();
import BurritoStore from '../../src/store/BurritoStore';
import database from '../../src/database';
BurritoStore.setDatabase(database);

import { WebMock } from './slackMock';

// Set up webClient and fetch slackUsers
const wbc = new WebMock();

const SLACKUSERS = [];
const TYPES = ['give', 'takeaway'];

function pickRandom(input) {
    switch (input) {
        case 'user':
            return SLACKUSERS[Math.floor(Math.random() * SLACKUSERS.length)]
            break;
    }
}

async function give(to, from) {
    await BurritoStore.giveBurrito(to, from)
}

async function takeaway(to, from) {
    await BurritoStore.takeAwayBurrito(to, from)
}

async function init() {

    const users = await wbc.users.list();
    users.members.forEach(x => {
        if (!x.is_bot) SLACKUSERS.push(x.id)
    })

    for (let i = 1; i <= 100; i++) {
        const fromUser = pickRandom('user');

        let toUser = pickRandom('user')
        while (fromUser === toUser) {
            toUser = pickRandom('user')
        }
        //await give(toUser, fromUser)

        const typeBurrito = TYPES[Math.floor(Math.random() * TYPES.length)]
        switch (typeBurrito) {
            case 'give':
                await give(toUser, fromUser);
                break;
            case 'takeaway':
                await takeaway(toUser, fromUser)
                break;
        }
    }
}

init().then(() => {
    console.log("Database filled with data");
});
