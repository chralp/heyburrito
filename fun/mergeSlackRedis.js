
module.exports = ((slack,redis) => {

    let res = []
    if(slack.length === 0){
        return false
    }
    redis.map( x =>{

        for (let u of slack){
            if((u.id) && (u.id.match(x.user))){
                let obj = {
                    username: x.user,
                    name: u.name,
                    score: x.score,
                    avatar: u.avatar
                }
                res.push(obj)
            }
        }
    })

    return res
})
