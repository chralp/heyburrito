

const log   =   require('bog')

module.exports = ((wbc) => {


    async function slackUsers (){
        let users = []
        log.info('Getting all slack users')
        await wbc.users.list().then((res) => {
            res.members.map( x => {
                if(!x.is_bot){
                    let obj = {
                        id: x.id,
                        name: x.real_name,
                        avatar: x.profile.image_48
                    }
                    users.push(obj)
                }
            })
        }).catch(console.error)
        return users
    }

    return { slackUsers }
})
