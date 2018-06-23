const log = require('bog');
const parseMessage = require('./lib/parseMessage');
const { validBotMention, validMessage } = require('./lib/validator')(true);


module.exports = ((rtm, emojis, storeminator, botUserID, getUserStats, allBots) => {

    function sendToUser(username, data){
        console.log("Will send to user", username)
        console.log("With data", data)

    }

    function listener() {
        log.info('Listening on slack messages');
        rtm.on('message', (event) => {
            if ((!!event.subtype) && (event.subtype === 'channel_join')) {
                log.info('Joined channel', event.channel);
            }

            if (event.type === 'message') {
                if (validMessage(event, emojis, allBots)) {
                    if (validBotMention(event, botUserID)) {
                        // Geather data and send back to user
                        getUserStats(event.user).then(res => {
                            sendToUser(event.user,res)
                        })

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
