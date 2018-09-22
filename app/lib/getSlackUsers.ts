
import log from 'bog'


async function slackUsers(wbc) {
    const users:Array<object> = [];
    const bots:Array<object> = [];
    log.info('Getting all slack users');
    await wbc.users.list().then((res) => {
        res.members.forEach((x) => {
            if (x.is_bot) {
                const obj = {
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                };
                bots.push(obj);
            } else {
                const obj = {
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                };
                users.push(obj);
            }
        });
    }).catch((err) => {
        log.warn(err);
    });
    return { users, bots };
}

export default slackUsers
