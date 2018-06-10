const log   =   require('bog')

module.exports = ((redis,client) => {

    function storeminator (msg) {

        for(let u of msg){
            if(u.type === 'inc'){
                client.incr(u.username, redis.print)
            }
            if(u.type === 'dec'){
                client.decr(u.username, redis.print)
            }

        }
    }
    return {storeminator}

})
