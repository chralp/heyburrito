import UserInterface from '../types/User.interface';
import SlackInterface from '../types/Slack.interface';

export default ((slackUsers: Array<SlackInterface.Stored>, data) => {

    const res: Array<UserInterface> = [];

    if (!data.length) return [];

    if (!slackUsers.length) return [];

    const user = slackUsers.filter(x => x.id === data[0]._id)[0]
    res.push({
        username: user.id,
        name: user.name,
        score: data[0].score,
        avatar: user.avatar,
    });

    return res;
});
