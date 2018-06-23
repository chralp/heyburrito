const log = require('bog');

module.exports = ((msg, botname) => {
    botid = botname();
    if ((msg.text.match(`<@${botid}>`)) && (msg.text.match('stats'))) {
        return true
    }
    return false
});
