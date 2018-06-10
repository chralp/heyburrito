
module.exports = ((redis,client) => {

    let score = []

    function getRedisUser () {

        client.keys('*', (err, keys) =>{
            if (err) return console.log(err);
            if(keys){
                for(let user of keys){
                     client.get(user, (error, value) =>{
                        let obj = {
                            username: user,
                            score: value
                        }
                        score.push(obj)
                    })
                }
            }
        })
        return score
    }
    return {getRedisUser}

})
