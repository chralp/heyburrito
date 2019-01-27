import UserInterface from '../types/User.interface';
import SlackInterface from '../types/Slack.interface';

export default ((slackUsers: Array<SlackInterface.Stored>, data) => {

    const res: Array<UserInterface> = [];

    if (!data) return [];

    if (!slackUsers) return [];

    slackUsers.filter(x => {
        for (const u of data) {
            if ((u._id === x.id) && (x.name)) {
                res.push({
                    username: u._id,
                    name: x.name,
                    score: u.score,
                    avatar: x.avatar,
                });
            }
        }
    })

    return res;
});
