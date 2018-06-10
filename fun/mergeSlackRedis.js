
module.exports = ((slack,redis) => {
    let res = []
    redis.map( x =>{
        for (let u of slack){
            if(!!u.id.match(x.username)){
                let obj = {
                    username: x.username,
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
