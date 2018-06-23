const log = require('bog');
const validate = require('./lib/validator');
const botMention = require('./lib/botMention');

module.exports = ((rtm, emojis, storeminator, botUserID,handleStats) => {
    function listener() {
        log.info('Listening on slack messages');
        rtm.on('message', (event) => {
            if ((!!event.subtype) && (event.subtype === 'channel_join')) {
                log.info('Joined channel', event.channel);
            }

            if (event.type === 'message') {
                // Message is changed, not valid!
                if ((!!event.subtype) && (event.subtype === 'message_changed')) {
                    return false;
                }
                // Message is changed, not valid!
                if ((!!event.subtype) && (event.subtype === 'message_deleted')) {
                    return false;
                }


                if (botMention(event, botUserID)) {

                    log.info('Bot is mention');
                    // Geather data and send back to user
                    handleStats(event)

                } else {
                    const result = validate(event, emojis);
                    if (result) {
                        storeminator(result);
                    }
                }
            }
        });
    }
    return { listener };
});
