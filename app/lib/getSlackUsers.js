

const log = require('bog');

module.exports = ((wbc) => {
    async function slackUsers() {
        const users = [];
        const bots = [];
        log.info('Getting all slack users');
        await wbc.users.list().then((res) => {
            res.members.forEach((x) => {
                if(x.is_bot){
                    let obj = {
                        id: x.id,
                        name: x.real_name,
                        avatar: x.profile.image_48,
                    };
                    bots.push(obj);
                }else{
                    let obj = {
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
        return {users, bots}
    }

    return { slackUsers };
});
