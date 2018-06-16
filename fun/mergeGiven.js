
module.exports = ((slackUsers,given) => {

    var counts = {};

    for (var i = 0; i < given.length; i++) {
        counts[given[i]] = 1 + (counts[given[i]] || 0);
    }

    res = []
    slackUsers.map (x => {

        if(!!counts[x.id]){
            let obj ={
                id: x.id,
                name: x.name,
                score: counts[x.id],
            }
            res.push(obj)
        }
    })

    return res
})
