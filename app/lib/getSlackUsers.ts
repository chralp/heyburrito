import { default as log } from 'bog';
import SlackUserInterface from '../types/SlackUser.interface';

async function slackUsers(wbc) {

    const users:Array<SlackUserInterface> = [];
    const bots:Array<SlackUserInterface> = [];

    log.info('Getting slack users');

    await wbc.users.list().then((res) => {

        res.members.forEach((x:any) => {

            if (x.is_bot) {
                bots.push({
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                });
            } else {
                users.push({
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                });
            }
        });
    })

    .catch((err) => {

        log.warn(err);

    });

    return { users, bots };
}

export default slackUsers;
