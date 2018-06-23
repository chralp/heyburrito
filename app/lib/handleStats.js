
const store = require('../store/burrito');

module.exports = ((redis, client, dailyCap) => {
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
    } = store(redis, client);


    function handleStats (msg){
        console.log("OHSS", msg)

        getGivenCap(msg.user)
        .then((result) => {
            return result
        })
        .then((givenToday) => {
            getGivers(user)
        })
        .then((res) => {
            mergeGiven(serverStoredSlackUsers(), res)
        })
        .then((givers) => {
            getGiven(user)
        })

        .then((gived) => {
            getUserScore(user)
        })

        .then((res) => {
            console.log("res",res)
        })
    }

        // Get top 10 Recived
        // Get top 10 Givers
        // Get userStats
        //  - top 10 givers ( ? )
        //  - Given Count,


    return {handleStats}

});
