
module.exports = ((redis,client) => {

    function getScore(user){
        return new Promise((rs,rj) =>{

            client.get(user, (error, value) =>{
                let obj = {
                    username: user,
                    score: value
                }
                rs(obj)
            })
        })

    }


    function getRedisUser () {

        return new Promise((rs,rj) =>{

            client.keys('*', (err, keys) =>{
                if (err) return console.log(err);
                if(keys){
                    waitFor = (() =>{
                        let score = []

                        for(let user of keys){
                            score.push(getScore(user).then((result)=>{
                                return result
                            }))
                        }
                        return score;
                    })();
                    Promise.all(waitFor).then((res)=>{
                        rs(res)
                    })
                }
            })

        })
    }
    return {getRedisUser}

})
