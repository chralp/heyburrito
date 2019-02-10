import BurritoStore from '../store/BurritoStore';
import { default as log } from 'bog';
import config from '../lib/config'

import Bot from '../Bot'

const dailyCap: number = parseInt(config("SLACK_DAILY_CAP"));

async function handleMsg(giver: string, updates) {

    // Get given burritos today
    const burritos = await BurritoStore.givenBurritosToday(giver)

    log.info(`${giver} has given ${burritos.length} burritos today`);

    const diff = dailyCap - burritos.length

    if (updates.length > diff) {
        // Send message to user
        log.info(`User ${giver} is trying to give ${updates.length}, but u have only ${diff} left`)
        return;
    }

    if (burritos.length >= dailyCap) {
        log.info(`Daily cap of ${dailyCap} reached`);
        return;
    }

    const a = updates.shift();

    if (a.type === 'inc') {

        await BurritoStore.giveBurrito(a.username, giver)
        if (updates.length) {
            handleMsg(giver, updates);
        }

    } else if (a.type === 'dec') {
        await BurritoStore.takeAwayBurrito(a.username, giver)
        if (updates.length) {
            handleMsg(giver, updates);
        }
    }
}

function storeminator(msg) {
    const { giver, updates } = msg;

    if (updates.length) {
        handleMsg(giver, updates);
    }
}

export default storeminator;
