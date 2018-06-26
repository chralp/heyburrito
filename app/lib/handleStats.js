const BurritoStore = require('../store/burrito');
const mergeGiven = require('./mergeGiven');

module.exports = ((serverStoredSlackUsers) => {
    function getUserStats(username) {
        // TODO
        return Promise.resolve(false)
    }

    function getRecivedBoard() {
        // Get all users recived
        // Arange array desc
    }

    function getGivenBoard() {
        // Get all users Given
        // Arange array desc
    }

    return { getUserStats };

});
