

const log = require('bog');

module.exports = ((wbc) => {
    async function slackUsers() {
        const users = [];
        log.info('Getting all slack users');
        await wbc.users.list().then((res) => {
            res.members.forEach((x) => {
                const obj = {
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                };
                users.push(obj);
            });
        }).catch((err) => {
            log.warn(err);
        });
        return users;
    }

    return { slackUsers };
});
