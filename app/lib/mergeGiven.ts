/*
* Merge data from recivedLog and SlackUsers,
* create object foreach user
* Input: [USERONE,USERONE,USERTWO,USERONE]
* OUTPUT: [
*   { id: 'USERONE', name: 'userone name', score: 3 },
*   { id: 'USERTWO', name: 'usertwo name', score: 1 }
* ]
*
*/
export default ((slackUsers:Array<object>, given) => {
    const counts:object = {};

    for (let i = 0; i < given.length; i += 1) {
        counts[given[i]] = 1 + (counts[given[i]] || 0);
    }

    const res:Array<object> = [];
    slackUsers.forEach((x:any) => {
        if (counts[x.id]) {
            const obj:object = {
                id: x.id,
                name: x.name,
                score: counts[x.id],
            };

            res.push(obj);
        }
    });

    return res;
});
