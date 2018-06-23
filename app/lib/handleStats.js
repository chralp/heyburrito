
const store = require('../store/burrito');
const mergeGiven = require('./mergeGiven');

module.exports = ((redis, client, serverStoredSlackUsers) => {
    const {
        giveBurrito,
        takeAwayBurrito,
        incrGiven,
        addGiver,
        getGivers,
        incrGivenCap,
        getGivenCap,
        getFullScore,
        getUserScore,
        getGiven,
        getUserReceived,
    } = store(redis, client);



    function getUserStats(username) {

        return new Promise(resolve => {

            getGivers(username)
            .then(res => mergeGiven(serverStoredSlackUsers(), res))
            .then((givers) => {
                getGiven(username).then((gived) => {
                    getUserReceived(username).then((received) => {
                        getGivenCap(username).then((givenToday) => {
                            const obj = {
                                gived,
                                received,
                                givenToday: givenToday.length,
                                givers,
                            }
                            resolve(obj)
                        });
                    });
                });
            });
        });
    }


    function getRecivedBoard() {
        // Get all users recived
        // Arange array desc
    }

    function getGivenBoard() {
        // Get all users Given
        // Arange array desc
    }


    return {getUserStats, getRecivedBoard,getGivenBoard}

});
