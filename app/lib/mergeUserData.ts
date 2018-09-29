import UserInterface from '../types/User.interface'
import SlackUserInterface from '../types/SlackUser.interface'

export default ((slackUsers:Array<SlackUserInterface>, data) => {
    const res:Array<UserInterface> = [];
    if (slackUsers.length === 0) {
        return [];
    }

    data.forEach((x) => {
        slackUsers.forEach((u) => {
            if ((u.id) && (u.id.match(x._id))) {
                const obj:UserInterface = {
                    username: x._id,
                    name: u.name,
                    score: x.score,
                    avatar: u.avatar,
                };
                res.push(obj);
            }
        });
    });

    return res;
});
