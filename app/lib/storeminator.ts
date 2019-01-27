import BurritoStore from '../store/BurritoStore';
import { default as log } from 'bog';

const dailyCap: number = process.env.SLACK_DAILY_CAP ? parseInt(process.env.SLACK_DAILY_CAP) : 5;

function handleMsg(giver: string, updates) {
    BurritoStore.givenBurritosToday(giver).then((burritos) => {
        log.info('%s has given %d burritos today', giver, burritos.length);

        if (burritos.length >= dailyCap) {
            log.info('Daily cap of %d reached', dailyCap);
            return;
        }

        const a = updates.shift();

        if (a.type === 'inc') {
            BurritoStore.giveBurrito(a.username, giver)
                .then(() => {
                    if (updates.length) {
                        handleMsg(giver, updates);
                    }
                });
        } else if (a.type === 'dec') {
            BurritoStore.takeAwayBurrito(a.username, giver)
                .then(() => {
                    if (updates.length) {
                        handleMsg(giver, updates);
                    }
                });
        }

    });
}

function storeminator(msg) {
    const { giver, updates } = msg;

    if (updates.length) {
        handleMsg(giver, updates);
    }
}

export default storeminator;
