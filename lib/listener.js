const log = require('bog');
const validate = require('../fun/validator');

module.exports = ((rtm, emojis, storeminator) => {
    function listener() {
        log.info('Listening on slack messages');
        rtm.on('message', (event) => {
            if ((!!event.subtype) && (event.subtype === 'channel_join')) {
                log.info('Joined channel', event.channel);
            }

            if (event.type === 'message') {
                const result = validate(event, emojis);
                if (result) {
                    storeminator(result);
                }
            }
        });
    }
    return { listener };
});
