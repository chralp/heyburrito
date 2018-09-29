import UserInterface from '../types/User.interface';
import SlackUserInterface from '../types/SlackUser.interface';

export default ((slackUsers:Array<SlackUserInterface>, data) => {

    const res:Array<UserInterface> = [];

    if (slackUsers.length === 0) {
        return [];
    }

    data.forEach((x) => {

        slackUsers.forEach((u) => {

            if ((u.id) && (u.id.match(x._id))) {
                res.push({
                    username: x._id,
                    name: u.name,
                    score: x.score,
                    avatar: u.avatar,
                });
            }

        });
    });

    return res;
});
