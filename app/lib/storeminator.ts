import config from './config';
import BurritoStore from '../store/BurritoStore';
import { default as log } from 'bog';

const dailyCap:string = config('SLACK_DAILY_CAP');

function handleMsg(giver, updates) {
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
