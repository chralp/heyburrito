import UserInterface from '../types/User.interface';
import SlackInterface from '../types/Slack.interface';
import LocalStore from '../store/LocalStore'

export default (data) => {

    const res: Array<UserInterface> = [];
    const slackUsers = LocalStore.getSlackUsers()

    if (!data) return [];


    if (!slackUsers) return [];
    slackUsers.filter(x => {
        for (const u of data) {
            if ((u._id === x.id) && (x.name)) {
                res.push({
                    username: u._id,
                    name: x.name,
                    score: u.score,
                    given: u.givenTotal,
                    today: u.givenToday,
                    avatar: x.avatar,
                });
            }
        }
    })

    return res;

};
