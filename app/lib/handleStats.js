
const store = require('../store/burrito');
const mergeGiven = require('./mergeGiven');
const mergeData = require('./mergeSlackRedis');

module.exports = ((redis, client, serverStoredSlackUsers) => {
    const {
        getGiven,
        giveBurrito,
        takeAwayBurrito,
        incrGiven,
        getUserScores,
        addGiver,
        getGivers,
        incrGivenCap,
        getGivenCap,
        setKeyToExpire,
        getAllReceived,
        getUserScore,
        getUserReceived,
        getAllGiven,
    } = store(redis, client);

    function getUserStats(username) {

        return new Promise(resolve => {

            getGivers(username)
            .then(res => mergeGiven(serverStoredSlackUsers(), res))
            .then((givers) => {
                getGiven(username).then((gived) => {
                    getUserReceived(username).then((received) => {
                        getGivenCap(username).then((givenToday) => {
                            profile = mergeData(serverStoredSlackUsers(),[{user:username}])
                            const obj = {
                                id: profile[0].username,
                                name: profile[0].name,
                                avatar: profile[0].avatar,
                                received,
                                gived,
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

    function getRecivedList() {
        // Get all users recived
        // Arange array desc
        return new Promise(resolve => {
            getAllReceived()
            .then(res => mergeData(serverStoredSlackUsers(), res))
            .then((receivedList) => {
                receivedList.sort((a, b) => Math.sign(b.score - a.score));
                resolve(receivedList)
            })
        })
    }

    function getGivenList() {
        // Get all users Given
        // Arange array desc
        return new Promise(resolve => {
            getAllGiven()
            .then(res =>mergeData(serverStoredSlackUsers(), res))
            .then((givenList) => {
                givenList.sort((a, b) => Math.sign(b.score - a.score));
                resolve(givenList)
            })
        })
    }

    function getRottenGivenList() {
        // Arange array desc
    }

    function getRottenRecivedList() {
        // Arange array desc
    }




    return {getUserStats, getRecivedList,getGivenList}

});
