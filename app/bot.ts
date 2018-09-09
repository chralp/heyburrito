import * as log from 'bog'
const parseMessage = require('./lib/parseMessage')(true)

const { validBotMention, validMessage } = require('./lib/validator')(true)
const { storeminator } = require('./lib/storeminator')(true)

const emojis = [];

if (process.env.SLACK_EMOJI_INC) {
    const incEmojis = process.env.SLACK_EMOJI_INC.split(',');
    incEmojis.forEach(emoji => emojis.push({ type: 'inc', emoji }));
}

if (process.env.SLACK_EMOJI_DEC) {
    const incEmojis = process.env.SLACK_EMOJI_DEC.split(',');
    incEmojis.forEach(emoji => emojis.push({ type: 'dec', emoji }));
}

module.exports = ((rtm, botUserID, getUserStats, allBots) => {
    function sendToUser(username, data) {
        log.info('Will send to user', username);
        log.info('With data', data);
    }

    function listener() {
        log.info('Listening on slack messages');
        rtm.on('message', (event) => {
            console.log("rtm.on", event)
            if ((!!event.subtype) && (event.subtype === 'channel_join')) {
                log.info('Joined channel', event.channel);
            }

            if (event.type === 'message') {
                if (validMessage(event, emojis, allBots)) {
                    if (validBotMention(event, botUserID)) {
                        // Geather data and send back to user
                        getUserStats(event.user).then((res) => {
                            sendToUser(event.user, res);
                        });
                    } else {
                        const result = parseMessage(event, emojis);
                        if (result) {
                            storeminator(result);
                        }
                    }
                }
            }
        });
    }
    return { listener };
});
