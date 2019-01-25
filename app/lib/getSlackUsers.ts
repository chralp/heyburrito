import { default as log } from 'bog';
import SlackInterface from '../types/Slack.interface';

/**
  * @param wbc slackk/WebClient.
  * @returns object containing array users and bots.
  */
async function slackUsers(wbc) {
    const users: Array<SlackInterface.Stored> = [];
    const bots: Array<SlackInterface.Stored> = [];

    log.info('Getting slack users');

    await wbc.users.list()
        .then((res: SlackInterface.WbcList) => {
            res.members.forEach((x: any) => {

                // reassign correct array to arr
                const arr = x.is_bot ? bots : users
                arr.push({
                    id: x.id,
                    name: x.real_name,
                    avatar: x.profile.image_48,
                })
            });
        })
        .catch((err) => {
            log.warn(err);
        });
    return { users, bots };
}

export default slackUsers;
