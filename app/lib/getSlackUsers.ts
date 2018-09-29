import log from 'bog'
import SlackUsersInterface from '../types/SlackUser.interface'

async function slackUsers(wbc) {

    const users:Array<SlackUsersInterface> = [];
    const bots:Array<SlackUsersInterface> = [];

    log.info('Getting all slack users');

    await wbc.users.list().then((res) => {

        res.members.forEach((x:any) => {

            if (x.is_bot) {
                bots.push({
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48
                });
            } else {
                users.push({
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                });
            };
        });
    })

    .catch((err) => {

        log.warn(err);

    });

    return { users, bots };
}

export default slackUsers
