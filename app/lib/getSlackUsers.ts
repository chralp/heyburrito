import { default as log } from 'bog';
import SlackInterface from '../types/Slack.interface';

/**
  * @param wbc slack/WebClient.
  * @returns object containing array users and bots.
  */
async function slackUsers(wbc) {
    const users: Array<SlackInterface.Stored> = [];
    const bots: Array<SlackInterface.Stored> = [];

    log.info('Fetching slack users via wbc');

    const result: SlackInterface.WbcList = await wbc.users.list()
    result.members.forEach((x: any) => {

        // reassign correct array to arr
        const arr = x.is_bot ? bots : users
        arr.push({
            id: x.id,
            name: x.real_name,
            avatar: x.profile.image_48,
        })

    });

    return { users, bots };
}

export default slackUsers;
